# Kadena-NEXUS

Source for the [Kadena Nexus](https://kadena.ws) community sites. One product per branch (this will become one repository per product; see "Plan" below). Deployed by file swap on Hetzner, not from Vercel.

## Branch map

| Branch | Product | Live at | Notes |
|---|---|---|---|
| `main-saudi` | Kadena Devs site (React + Strapi CMS) | https://kadenadevs.kadena.ws | Being replaced by a static page (challenge program closed). |
| `marketplace` | Kadena P2P Marketplace | https://marketplace.kadena.ws | Continues the old `Cool-Dev` tip (11a381b). Deploy guide and pinned contract inside. |
| `KDA-Monitor-dashboard` | Kadena Network Monitor | https://nodes.kadena.ws | Mustafa, Oct 2026 rebuild. |
| `Kadena-Earn` | Kadena Earn | https://earn.kadena.ws | Mustafa. |
| `adoption-index` | Kadena Adoption Index | https://adoption.kadena.ws | Mustafa. |
| `codex/kadena-homepage-node`, `codex/oracle-saudi-node` | kadena.ws homepage node card, Saudi node | https://kadena.ws | Mustafa, Oct 2026. |
| `recovered/Cool-Dev-marketplace` | Marketplace as of 26 Apr 2026 (11a381b) | | Restored after the 12 Aug force-push. Superseded by `marketplace`. |
| `recovered/P2P-dev` | Marketplace, Mirza's branch, 9 Apr 2026 | | Contains a committed `.env`; the credentials in it must be treated as leaked. |
| `recovered/P2P-Marketplace-MVP` | Mica's original MVP, 9 Feb 2026 | | History only. |
| `recovered/KDA-Monitor-dashboard-apr26` | Monitor branch before the October rebuild | | History only. |

## What happened on 12 Aug 2026

A force-push from a contributor's machine set eight branches (`main-saudi`, `Cool-Dev`, `KDA-Monitor-dashboard`, `Kadena-Devs-challenge-website`, all `ARCHIVED-*`) to the same Devs-site commit (f16645f). The overwritten tips were still on GitHub as unreachable commits and were restored on 10 Oct 2026 under `recovered/*`. The live sites were unaffected because they are deployed from the servers, but GitHub had no current copy of them until the server working copies were pushed back.

## Rules

1. Never force-push to a shared branch. Branch protection is on for the product branches where the plan allows it.
2. `.env` files are never committed; use `.env.example`. Secret scanning with push protection is enabled.
3. Tag every deployment (`deploy-<product>-YYYY-MM-DD`) so "what exactly is live" is always answerable.
4. Each product has a `README.md` (what, who, how to build) and a `DEPLOY.md` (server path, nginx, process manager).
5. The Pact module a product talks to is pinned under `contracts/deployed/` with its version and deploy request key.

## Plan

Move to one repository per product under a Kadena Nexus GitHub organization (`kadena-nexus-marketplace`, `-monitor`, `-earn`, `-adoption`, `-devs`, `-homepage`, `-quantum`), seeded from the branches above, then archive this repository read-only.

## Credits

Kadena Devs site: Tahir Khan. Marketplace: Mica Dimic, Mirza Muhammad Baig, Mustafa Zahid. Network Monitor, Earn, Adoption Index, homepage: Mustafa Zahid (Kadena Nexus dev team). Project lead: Saudi.KDA.
