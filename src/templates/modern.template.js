const getModernTemplate = () => {
  const template = `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{FULL_NAME}} – CV</title>
  <style>
    :root{
      --bg:#0b0f19; --card:#121826; --ink:#e6e8ee; --muted:#a6adbb; --accent:#6c8cff;
    }
    *{box-sizing:border-box}
    html,body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif}
    .wrap{max-width:900px;margin:32px auto;padding:0 20px}
    .card{background:var(--card);border:1px solid #1e2636;border-radius:16px;padding:20px 22px;box-shadow:0 6px 24px rgba(0,0,0,.25)}
    header{display:flex;justify-content:space-between;gap:16px;align-items:flex-end;border-bottom:1px solid #27314a;padding-bottom:12px;margin-bottom:16px}
    .name{font-size:28px;font-weight:800}
    .contact{color:var(--muted);font-size:13px;display:flex;gap:10px;flex-wrap:wrap}
    h2{font-size:13px; text-transform:uppercase; letter-spacing:.16em; color:var(--accent); margin:18px 0 8px}
    .grid{display:grid;grid-template-columns:1.1fr .9fr;gap:22px}
    @media (max-width:840px){.grid{grid-template-columns:1fr}}
    .role-row{display:flex;justify-content:space-between;gap:12px}
    .when,.loc{color:var(--muted)}
    .pill{display:inline-block;border:1px solid #2b3756;padding:6px 10px;border-radius:999px;margin:4px 6px 0 0}
    ul{margin:8px 0 0 16px}
    .avatar{width:72px;height:72px;border-radius:50%;object-fit:cover;border:1px solid #2b3756;display:none}
  </style>
  </head>
<body>
  <div class="wrap">
    <div class="card">
      <header>
        <div class="name">{{FULL_NAME}}</div>
        <div class="contact">
          <span>{{CITY_AND_COUNTRY}}</span>
          <span>•</span>
          <span>{{EMAIL}}</span>
          <span>•</span>
          <span>{{PHONE_DISPLAY}}</span>
          <span>•</span>
          <span>{{LINKEDIN_HANDLE}}</span>
        </div>
        {{PHOTO_BLOCK}}
      </header>

      <div class="grid">
        <main>
          <h2>Perfil</h2>
          <p>{{PROFESSIONAL_SUMMARY}}</p>

          <h2>Experiencia</h2>
          <!-- REPEAT: EXPERIENCE_BLOCK -->
          <div class="item">
            <div class="role-row">
              <div class="role">{{JOB_TITLE}} — {{COMPANY_NAME}}</div>
              <div class="when">{{START_DATE}} – {{END_DATE}}</div>
            </div>
            <div class="loc">{{LOCATION}}</div>
            <ul>
              <!-- REPEAT: ACHIEVEMENT -->
              <li>{{ACHIEVEMENT_TEXT}}</li>
              <!-- /REPEAT -->
            </ul>
          </div>
          <!-- /REPEAT -->

          <h2>Formación</h2>
          <!-- REPEAT: EDUCATION_BLOCK -->
          <div class="item">
            <div class="role-row">
              <div class="role">{{DEGREE_OR_PROGRAM}}</div>
              <div class="when">{{EDU_START_YEAR}} – {{EDU_END_YEAR}}</div>
            </div>
            <div class="loc">{{INSTITUTION_NAME}} • {{EDU_LOCATION}}</div>
          </div>
          <!-- /REPEAT -->
        </main>

        <aside>
          <h2>Habilidades</h2>
          <div>
            <!-- REPEAT: HARD_SKILL -->
            <span class="pill">{{HARD_SKILL}}</span>
            <!-- /REPEAT -->
          </div>

          <h2>Idiomas</h2>
          <ul>
            <!-- REPEAT: LANGUAGE -->
            <li>{{LANGUAGE_NAME}} — {{LANGUAGE_LEVEL}}</li>
            <!-- /REPEAT -->
          </ul>
        </aside>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  return template;
}

module.exports = getModernTemplate;


