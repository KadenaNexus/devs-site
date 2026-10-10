# Kadena Devs site

Source of https://kadenadevs.kadena.ws, part of [Kadena Nexus](https://kadena.ws).

Two generations live here:

| Path | What it is | Status |
|---|---|---|
| `static-site/` | Single-page static site (Oct 2026): projects list, contact section, dark mode. `index.html`, `og.png`, `nginx-kadenadevs.conf` (static root plus 301 redirects for every old app route), `INSTRUCTIONS.txt` for deployment. | Current. Deploy this. |
| `apps/web` | The original challenge platform: React 19 + Vite, TanStack Router, Clerk sign-in, Supabase (challenges, submissions, judges, winners, chats, admin). | Legacy. Retired with the challenge program; kept for history and for the submission data model. |
| `apps/cms` | Strapi CMS that fed the original homepage, FAQ, how-it-works and team pages. | Legacy, same as above. |

Credits: original platform built by Tahir Khan (Jan to Apr 2026). Static site by Saudi.KDA with Claude. Deployment by Mustafa Zahid.

Deploying the static site: follow `static-site/INSTRUCTIONS.txt` (copy `index.html` and `og.png` to the web root, install the nginx block, reload). The redirects in the nginx file keep old links (`/challenge-list`, `/winners-page`, `/project-submission`, `/sign-in`, `/dashboard`, ...) working.

History note: this repository was split out of `KadenaSaudi/Kadena-NEXUS` (branch `main-saudi`) on 10 Oct 2026.
