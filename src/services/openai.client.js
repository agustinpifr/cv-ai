const OpenAI = require("openai");
const fs = require("fs");
const os = require("os");
const path = require("path");
const getHarvardTemplate = require("../templates/harvard.template");
const getModernTemplate = require("../templates/modern.template");
const { getAllAnswers } = require("../repositories/answer.repository");

const generateHTML = async (userId, { templateName = "harvard", photoUrl = null } = {}) => {
	const OPENAI_API_KEY  = process.env.OPEN_AI_API_KEY;
	if (!OPENAI_API_KEY) {
		throw new Error("Missing OPENAI_API_KEY env var");
	}

	// 1) Nos traemos las respuestas del usuario
	const answers = await getAllAnswers(userId);

	// 2) Cargamos el template
	let template = "";
	switch (templateName) {
		case "harvard":
		default:
			template = getHarvardTemplate();
			break;
		case "modern":
			template = getModernTemplate();
	}

	// 3) Compose prompt
	const systemInstruction =
		"You are an assistant that outputs only valid standalone HTML. " +
		"Use the provided HTML template strictly and insert the user's answers appropriately. " +
		"If any field has no data, remove that element. If a section becomes empty, remove the entire section. " +
		"Remove any unresolved placeholders like {{VARIABLE}}. " +
		"Do not include code fences, markdown, JSON, or explanations. Output only HTML.";

	const userMessage = [
		"Template:\n",
		template,
		"\n\nUser Answers (JSON):\n",
		JSON.stringify(answers, null, 2),
		photoUrl ? `\n\nUser Photo URL:\n${photoUrl}\n` : "",
		"\n\nRequirements:\n",
		"- Preserve the template structure and styles.\n",
		"- Integrate the answers into the appropriate sections.\n",
		photoUrl ? `- Replace {{PHOTO_BLOCK}} with: <img src="${photoUrl}" alt="Photo" class="avatar" />\n` : "- Remove {{PHOTO_BLOCK}} placeholder entirely.\n",
		"- Remove dates or any content that is not related to the user's answers and that is not final to be printed.\n",
		"- Remove any unresolved placeholders like {{VAR}}.\n",
		"- Delete elements that would be empty after fill; remove entire empty sections.\n",
		"- Do not leave dangling separators (e.g., bullets) without adjacent data.\n",
		"- Return ONLY valid HTML markup."
	].join("");

	// 4) Call OpenAI
	const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
	const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
	const response = await openai.chat.completions.create({
		model,
		messages: [
			{ role: "system", content: systemInstruction },
			{ role: "user", content: userMessage }
		]
	});

	const html = response?.choices?.[0]?.message?.content || "";
	const cleaned = cleanupPlaceholders(html);
	return cleaned;
};

// Quitar placeholders y elementos vacíos que no fueron vaciados por el LLM
function cleanupPlaceholders(html) {
	if (!html) return html;
	let out = html;
	// Quitar comentarios HTML
	out = out.replace(/<!--[\s\S]*?-->/g, "");
	// Quitar cualquier token {{PLACEHOLDER}} restante
	out = out.replace(/\{\{[^}]+\}\}/g, "");
	// Quitar elementos vacíos de la lista
	out = out.replace(/<li>\s*<\/li>/gi, "");
	// Quitar contenedores genéricos vacíos (ejecutar múltiples pasadas para colapsar)
	const emptyTagPattern = /<(div|span|p|a|section|header|main|aside|ul|ol|h[1-6])[^>]*>\s*<\/\1>/gi;
	for (let i = 0; i < 3; i++) {
		out = out.replace(emptyTagPattern, "");
	}
	// Remove empty lists after removing items
	out = out.replace(/<(ul|ol)[^>]*>\s*<\/\1>/gi, "");
	// Colapsar líneas en blanco excesivas
	out = out.replace(/\n{3,}/g, "\n\n");
	return out;
}

const transcribeAudio = async ({ audioBase64, mimeType, language = "es" }) => {
	const OPENAI_API_KEY  = process.env.OPENAI_API_KEY || process.env.OPEN_AI_API_KEY;
	if (!OPENAI_API_KEY) {
		throw new Error("Missing OPENAI_API_KEY (or OPEN_AI_API_KEY) env var");
	}
	const client = new OpenAI({ apiKey: OPENAI_API_KEY });
	const model = process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe";

	// Remove data URL prefix if present
	const base64 = audioBase64.replace(/^data:[^;]+;base64,/, '');
	let buffer;
	try {
		buffer = Buffer.from(base64, 'base64');
		if (!buffer || buffer.length === 0) throw new Error('Invalid base64');
	} catch (e) {
		throw new Error('Invalid audioBase64 payload');
	}

	// Map mime to extension
	const mimeToExt = {
		"audio/mpeg": "mp3",
		"audio/mp3": "mp3",
		"audio/wav": "wav",
		"audio/webm": "webm",
		"audio/ogg": "ogg",
		"audio/m4a": "m4a",
		"audio/x-m4a": "m4a",
		"audio/mp4": "mp4"
	};
	const ext = mimeToExt[mimeType] || (mimeType?.split('/')?.[1]) || 'mp3';
	const tmpPath = path.join(os.tmpdir(), `upload-${Date.now()}.${ext}`);
	await fs.promises.writeFile(tmpPath, buffer);
	try {
		const response = await client.audio.transcriptions.create({
			file: fs.createReadStream(tmpPath),
			model,
			language
		});
		const text = response?.text || response?.results?.[0]?.alternatives?.[0]?.transcript || "";
		if (!text) throw new Error("Transcription failed or returned empty text");
		return text;
	} finally {
		// borrar archivo temporal
		fs.promises.unlink(tmpPath).catch(() => {});
	}
}


module.exports = {
	generateHTML,
    transcribeAudio       
}