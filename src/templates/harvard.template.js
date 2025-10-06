const getHarvardTemplate = () => {
    const template = `
                <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
                    <title>{{FULL_NAME}} – CV</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root{
                        --accent:#A51C30; /* Harvard Crimson */
                        --ink:#0E0F10;
                        --muted:#4A4F57;
                        --line:#E6E7EA;
                        --bg:#FFFFFF;
    }
    *{box-sizing:border-box}
                        html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);font-family: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Noto Sans", sans-serif; line-height:1.4}
                        /* Layout inspirado en Harvard: encabezado fuerte, regla tipográfica, columnas fluidas, foco en contenido */
                        .page{
                        max-width: 960px; margin: 40px auto; padding: 0 28px;
    }
    header{
                        border-bottom: 3px solid var(--accent);
                        padding-bottom: 16px; margin-bottom: 20px;
                        }
                        .name{
                        font-size: 30px; font-weight: 800; letter-spacing: .2px;
                        }
                        .contact{
                        margin-top: 6px; color: var(--muted); font-size: 14px; display:flex; flex-wrap:wrap; gap:10px
                        }
                        .contact a{color:inherit; text-decoration:none; border-bottom:1px dotted var(--muted)}
                        .two-col{
                        display:grid; grid-template-columns: 1.2fr .8fr; gap: 28px;
                        }
                        @media (max-width: 820px){ .two-col{ grid-template-columns: 1fr; } }
                        h2{
                        font-size: 15px; text-transform:uppercase; letter-spacing: .12em; font-weight: 800;
                        margin: 22px 0 10px; color: var(--accent)
                        }
                        section{padding-bottom: 10px; border-bottom:1px solid var(--line); margin-bottom: 14px}
                        .item{margin:10px 0}
                        .role-row{display:flex; justify-content:space-between; gap:12px; align-items:baseline}
                        .role{font-weight: 700}
                        .org{color:var(--ink)}
                        .when{color:var(--muted); font-size: 13px; white-space:nowrap}
                        .loc{color:var(--muted); font-size: 13px}
                        .bullets{margin:8px 0 0 0; padding-left:18px}
                        .bullets li{margin:4px 0}
                        .pill{
                        display:inline-block; border:1px solid var(--line); padding:6px 10px; border-radius:999px; margin:4px 6px 0 0; font-size:13px
                        }
                        .stack{display:flex; flex-wrap:wrap}
                        .tight{margin:6px 0}
                        .objective{
                        background: #F8F8F9; border:1px solid var(--line); padding:12px 14px; border-radius:10px; color:#2a2d31
                        }
                        .avatar{
                        width:84px; height:84px; border-radius:50%; object-fit:cover; border:2px solid var(--accent); float:right; margin-top:-4px; margin-left:16px; display:none
                        }
                        /* print */
                        @page{margin: 1.3cm}
    @media print{
                        .page{max-width:none; margin:0; padding:0}
                        a{color:inherit; text-decoration:none}
                        section{break-inside:avoid}
    }
  </style>
</head>
<body>
                    <div class="page">

                        <!-- ENCABEZADO: Q1 -->
                        <header data-qid="68d719cb6fdc8e170568dd4f">
                        {{PHOTO_BLOCK}}
                        <div class="name">{{FULL_NAME}}</div>
                        <div class="contact">
                            <span>{{CITY_AND_COUNTRY}}</span>
                            <span>•</span>
                            <a href="mailto:{{EMAIL}}">{{EMAIL}}</a>
                            <span>•</span>
                            <a href="tel:{{PHONE_E164}}">{{PHONE_DISPLAY}}</a>
                            <span>•</span>
                            <a href="{{LINKEDIN_URL}}" rel="noopener">{{LINKEDIN_HANDLE}}</a>
                            <!-- Opcionales -->
                            <!-- <span>•</span><a href="{{PORTFOLIO_URL}}">{{PORTFOLIO_LABEL}}</a> -->
                            <!-- <span>•</span><a href="{{GITHUB_URL}}">{{GITHUB_HANDLE}}</a> -->
    </div>
  </header>

                        <div class="two-col">
                        <!-- COLUMNA PRINCIPAL -->
                        <main>

                            <!-- PERFIL  + OBJETIVO -->
                            <section>
                            <h2>Perfil</h2>
                            <div class="tight" data-qid="68d719d36fdc8e170568dd51">{{PROFESSIONAL_SUMMARY}}</div>

                            <!-- Si Q9 existe, mostrar objetivo -->
                            <div class="tight objective" data-qid="68d71a086fdc8e170568dd5f">
                                <strong>Objetivo:</strong> {{TARGET_ROLE_OR_POSITION}}
    </div>
  </section>

                            <!-- EXPERIENCIA -->
                            <section>
                            <h2>Experiencia</h2>

                            <!-- REPEAT: EXPERIENCIA_RECIENTE -->
                            <!-- Duplicar este bloque por cada experiencia relevante reciente -->
                            <!-- REPEAT: EXPERIENCE_BLOCK -->
                            <div class="item" data-qid="68d719dc6fdc8e170568dd53">
                                <div class="role-row">
                                <div class="role">{{JOB_TITLE}}</div>
                                <div class="when">{{START_DATE}} – {{END_DATE}}</div>
        </div>
                                <div class="org">{{COMPANY_NAME}}</div>
                                <div class="loc">{{LOCATION}}</div>
                                <ul class="bullets" data-qid="68d719e46fdc8e170568dd55">
                                <!-- REPEAT: ACHIEVEMENT -->
                                <li>{{ACHIEVEMENT_TEXT}}</li>
                                <!-- /REPEAT -->
                                </ul>
      </div>
                            <!-- /REPEAT -->

                            <!-- REPEAT: OTROS_TRABAJOS -->
                            <!-- Duplicar por cada otro puesto relevante -->
                            <!-- REPEAT: OTHER_EXPERIENCE_BLOCK -->
                            <div class="item" data-qid="68d719ed6fdc8e170568dd57">
                                <div class="role-row">
                                <div class="role">{{OTHER_JOB_TITLE}}</div>
                                <div class="when">{{OTHER_START_DATE}} – {{OTHER_END_DATE}}</div>
      </div>
                                <div class="org">{{OTHER_COMPANY_NAME}}</div>
                                <div class="loc">{{OTHER_LOCATION}}</div>
                                <ul class="bullets">
                                <!-- REPEAT: OTHER_LEARNING -->
                                <li>{{KEY_LEARNING_OR_IMPACT}}</li>
                                <!-- /REPEAT -->
                                </ul>
    </div>
                            <!-- /REPEAT -->
                            </section>

                            <!-- FORMACIÓN -->
                            <section data-qid="68d719f46fdc8e170568dd59">
                            <h2>Formación Académica</h2>

                            <!-- REPEAT: EDUCATION_BLOCK -->
    <div class="item">
                                <div class="role-row">
                                <div class="role">{{DEGREE_OR_PROGRAM}}</div>
                                <div class="when">{{EDU_START_YEAR}} – {{EDU_END_YEAR}}</div>
        </div>
                                <div class="org">{{INSTITUTION_NAME}}</div>
                                <div class="loc">{{EDU_LOCATION}}</div>
                                <!-- Opcional -->
                                <!-- <div class="tight">{{HONORS_OR_GPA}}</div> -->
                                <!-- <div class="tight">{{RELEVANT_COURSEWORK}}</div> -->
      </div>
                            <!-- /REPEAT -->
                            </section>

                            <!-- EXTRAS -->
                            <section data-qid="68d71a0e6fdc8e170568dd61">
                            <h2>Adicional</h2>

                                <!-- Sub-sección: Proyectos -->
                            <!-- REPEAT: PROJECT -->
                            <div class="item">
                                <div class="role-row">
                                <div class="role">{{PROJECT_NAME}}</div>
                                <div class="when">{{PROJECT_YEAR}}</div>
      </div>
                                <div class="tight">{{PROJECT_SUMMARY}}</div>
                                <!-- <div class="tight"><a href="{{PROJECT_LINK}}">{{PROJECT_LINK_LABEL}}</a></div> -->
    </div>
                            <!-- /REPEAT -->

                            <!-- Sub-sección: Certificaciones -->
    <div class="item">
                                <div class="role"><strong>Certificaciones</strong></div>
                                <ul class="bullets">
                                <!-- REPEAT: CERT -->
                                <li>{{CERT_NAME}} – {{CERT_ISSUER}} ({{CERT_YEAR}})</li>
                                <!-- /REPEAT -->
                                </ul>
    </div>

                            <!-- Sub-sección: Voluntariado -->
                            <!-- REPEAT: VOLUNTEER -->
    <div class="item">
                                <div class="role-row">
                                <div class="role">{{VOL_ROLE}}</div>
                                <div class="when">{{VOL_START}} – {{VOL_END}}</div>
      </div>
                                <div class="org">{{VOL_ORG}}</div>
                                <ul class="bullets">
                                <!-- REPEAT: VOL_IMPACT -->
                                <li>{{VOL_IMPACT}}</li>
                                <!-- /REPEAT -->
                                </ul>
      </div>
                            <!-- /REPEAT -->
                            </section>

</main>

                        <!-- COLUMNA LATERAL -->
                        <aside>

                            <!-- HABILIDADES -->
                            <section data-qid="68d719fb6fdc8e170568dd5b">
                            <h2>Habilidades</h2>
                            <div class="tight"><strong>Técnicas</strong></div>
                            <div class="stack">
                                <!-- REPEAT: HARD_SKILL -->
                                <span class="pill">{{HARD_SKILL}}</span>
                                <!-- /REPEAT -->
                            </div>
                            <div class="tight" style="margin-top:10px"><strong>Blandas</strong></div>
                            <div class="stack">
                                <!-- REPEAT: SOFT_SKILL -->
                                <span class="pill">{{SOFT_SKILL}}</span>
                                <!-- /REPEAT -->
                            </div>
                            </section>

                            <!-- IDIOMAS -->
                            <section data-qid="68d71a016fdc8e170568dd5d">
                            <h2>Idiomas</h2>
                            <ul class="bullets">
                                <!-- REPEAT: LANGUAGE -->
                                <li>{{LANGUAGE_NAME}} — {{LANGUAGE_LEVEL}}</li>
                                <!-- /REPEAT -->
                            </ul>
                            </section>

                            <!-- LINKS OPCIONALES -->
                            <section>
                            <h2>Enlaces</h2>
                            <ul class="bullets">
                                <!-- REPEAT: LINK -->
                                <li><a href="{{LINK_URL}}">{{LINK_LABEL}}</a></li>
                                <!-- /REPEAT -->
                            </ul>
                            </section>

                        </aside>
                        </div>
                    </div>
</body>
</html>
    `;
    return template;
};

module.exports = getHarvardTemplate;
