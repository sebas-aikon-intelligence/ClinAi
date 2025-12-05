# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025-12-05

### 🤖 Agent-First Architecture Complete

**The Intersection: Ford + Musk + Rauch**

This release embodies the vision of three pioneers:
- **Henry Ford**: One perfected stack (no options, just execution)
- **Elon Musk**: The machine that builds the machine (commands > apps)
- **Guillermo Rauch**: Agent-First development (speed = intelligence)

### Added

#### Agent Role & Philosophy
- **"Tu Rol: Arquitecto Agent-First"** section in `saas-factory/CLAUDE.md`
- **DWY (Done With You) paradigm**: Human decides WHAT, Agent executes HOW
- **The 3 Principles**:
  1. Ford: Golden Path (no technical options)
  2. Musk: Process > Product (reusable systems)
  3. Rauch: Speed = Intelligence (100 iterations in 30 seconds)

#### Complete Project Structure
- **Feature-First Architecture** fully implemented in `src/`
- **Route Groups**: `app/(auth)/` and `app/(main)/` with layouts
- **Example Features**: `auth/` and `dashboard/` with complete folder structure
- **Shared Infrastructure**: 8 organized subdirectories (components, hooks, stores, types, utils, lib, constants, assets)
- **Template System**: `features/.template/` for rapid feature scaffolding
- **Documentation**: READMEs in every major directory explaining purpose and usage

#### Step-by-Step MCP Guide
- Added complete "Prendiendo el Next.js 16 MCP" guide to README.md
- 8-step process from `saas-factory` to running MCP
- Verification tests to confirm MCPs are working

### Changed

#### Documentation Overhaul
- **README.md**: Condensed from 424 to 228 lines (50% reduction, 20/80 principle)
- **Philosophy First**: Ford, Musk, Rauch quotes moved to top of README
- **Removed Technical Details**: Moved Agent-First Development details from README to CLAUDE.md
- **Workflow Consolidation**: Merged "Workflow Típico" and "Step-by-Step MCP" into single section

#### Stack Alignment
- **Updated all references**: Next.js 16, React 19, Tailwind 3.4
- **Removed Tailwind 4**: Unstable, reverted to 3.4 stable
- **Updated `/new-app` command**: Stack Confirmado section reflects correct versions

#### MCP Configuration
- **Fixed package names** in `.mcp.json`:
  - `@vercel/next-devtools-mcp@latest` (was `next-devtools-mcp`)
  - `@playwright/mcp@latest` (was `@anthropic-ai/playwright-mcp`)
  - Reordered: Next.js → Playwright → Supabase (Cerebro → Ojos → Backend)

### Technical

#### Files Created (40 new files)
```
src/
├── app/(auth)/
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── signup/page.tsx
├── app/(main)/
│   ├── layout.tsx
│   └── dashboard/page.tsx
├── features/
│   ├── .template/ (5 folders + README)
│   ├── auth/ (5 folders)
│   ├── dashboard/ (5 folders)
│   └── README.md
└── shared/
    ├── 8 subdirectories (.gitkeep in each)
    └── README.md
```

#### Commit Stats
- **40 files changed**
- **+522 insertions, -149 deletions**
- **Net: +373 lines** (despite 50% README reduction due to new structure)

### Philosophy Impact

**Before V2.1**: Agent had tools but no clear identity
**After V2.1**: Agent knows exactly who it is and how to work with humans

The agent now understands:
- Its role (Architect, not autonomous builder)
- Its constraints (Golden Path only, no invented options)
- Its collaboration model (DWY: Human designs, Agent executes)
- Its superpowers (Turbopack, MCPs, Feature-First context)

---

## [2.0.0] - 2025-12-05

### 🎯 Philosophy Change: "The Machine that Builds the Machine"

V2 adopts Henry Ford's assembly line philosophy - one perfected model instead of many options.

### Added
- **`/new-app` command**: Business Architect - interactive interview that generates `BUSINESS_LOGIC.md`
- **`/landing` command**: The Money Maker - high-conversion landing page generator
- **`metodologia-saas-factory.md`**: Complete SaaS Factory methodology (Delimitar → Deconstruir → Planificar → Ejecutar → Validar)
- **Golden Path stack**: Single optimized path (Next.js 15 + Supabase + Tailwind + shadcn/ui)

### Changed
- **Renamed `nextjs-claude-setup/` → `saas-factory/`**: Cleaner naming for the only template
- **Simplified alias**: `saas-factory` now copies from unified template
- **Email/Password auth by default**: Avoids OAuth bot-blocking during testing

### Removed
- **`python-claude-setup/`**: Unnecessary for SaaS factory (Next.js covers full-stack)
- **`auth-nextjs-template/`**: Auth now injected by agents, not as separate template
- **`setup/`**: Users use the Golden Path directly
- **Multiple template options**: One path, perfected

### Technical
- Repository renamed to `saas-factory-v2`
- Private repo for controlled distribution

---

## [1.3.1] - 2025-12-01

### Added
- **Formularios Directory**: Created `.claude/Formularios/` in all 3 setups (setup, nextjs-claude-setup, python-claude-setup)
- **FORMULARIO_LANDING.md**: Added landing page definition form to all setups for AI-driven landing page creation
- **FORMULARIO_PROYECTO.md**: Added project definition form to setup/ (was already in nextjs/python)

### Changed
- **File Organization**: Moved `FORMULARIO_PROYECTO.md` from root to `.claude/Formularios/` in nextjs-claude-setup and python-claude-setup
- All project forms now organized under `.claude/Formularios/` for consistency

---

## [1.3.0] - 2025-11-28

### Added

#### Documentación de MCPs en CLAUDE.md
- Sección **"🔌 MCPs Clave"** añadida a los 4 CLAUDE.md:
  - Chrome DevTools MCP: tabla de comandos + cuándo usar (bucle agéntico visual)
  - Supabase MCP: tabla de comandos + cuándo usar (acceso directo a BDD)
  - Referencia a `supabase-mcp-baas.md` para guía completa

#### Template auth-nextjs-template Documentado
- Añadido `auth-nextjs-template` como alias oficial
- Actualizada estructura del repositorio en CLAUDE.md raíz
- Documentado como "el más usado" para apps con autenticación pre-configurada

### Changed
- Versión del proyecto actualizada a v1.3.0
- Sección "Qué Incluye Cada Setup" ahora muestra 4 templates

---

## [1.2.0] - 2025-11-28

### Added

#### Nuevos Agentes Especializados (4)
- **frontend-specialist**: Experto en UI/UX, React, Tailwind CSS. Crea interfaces accesibles y performantes.
- **backend-specialist**: Experto en Server Actions, APIs, validaciones con Zod. Arquitectura Clean.
- **supabase-admin**: Experto en operaciones Supabase via MCP. Maneja BDD, RLS, Auth, Storage.
- **vercel-deployer**: Experto en deployments con Vercel CLI. Usa modelo `haiku` para rapidez y bajo costo.

#### Nuevos Prompts/Metodologías (5)
- **supabase-mcp-baas.md**: El 20% que produce el 80% del MCP de Supabase. Incluye los 5 comandos esenciales, patrones de uso, y flujo de trabajo recomendado.
- **nextjs-16-guide.md**: Guía completa de Next.js 16 (Cache Components, Turbopack, proxy.ts, React Compiler).
- **agent-builder-pydantic.md**: Guía para construir agentes IA con Pydantic AI + OpenRouter en Python.
- **agent-builder-vercel.md**: Guía para construir agentes IA con Vercel AI SDK + OpenRouter en Next.js.
- **INVESTIGACION-CLAUDE-CODE-V2.md**: Documento de investigación exhaustiva sobre componentes de `.claude/` según docs oficiales de Anthropic.

#### Estructura Completa en setup/ Base
- El setup base ahora incluye todos los agentes, commands, prompts y skills igual que los templates específicos.

### Changed

#### Reorganización de Skills → Prompts
- **Filosofía corregida**: Skills son para expertise que Claude activa automáticamente. Prompts son documentación de referencia.
- Movido `nextjs-16-complete-guide` de skills/ a prompts/
- Movido `agent-builder-pydantic-ai` de skills/ a prompts/
- Movido `agent-builder-vercel-sdk` de skills/ a prompts/

### Removed

#### Skills Eliminados (6)
- `nano-banana-image-combine/` - No relevante para la fábrica
- `replicate-integration/` - No relevante para la fábrica
- `supabase-auth-memory/` - Redundante con supabase-mcp-baas.md
- `nextjs-16-complete-guide/` - Movido a prompts/
- `agent-builder-pydantic-ai/` - Movido a prompts/
- `agent-builder-vercel-sdk/` - Movido a prompts/

### Technical Notes

#### Estructura Final de .claude/
```
.claude/
├── agents/     (7) - Agentes especializados con modelos y tools específicos
├── commands/   (7) - Slash commands invocados manualmente
├── prompts/    (6-7) - Metodologías y documentación de referencia
├── skills/     (1) - Solo skill-creator (verdadero skill con activación automática)
└── PRPs/       - Templates para Product Requirement Patterns
```

#### Diferenciación Correcta de Componentes
| Componente | Activación | Uso |
|------------|------------|-----|
| Commands | Manual (`/cmd`) | Prompts reutilizables |
| Agents | Delegado | Subagentes con contexto aislado |
| Skills | **Automática** | Expertise que Claude detecta |
| Prompts | Referencia | Metodologías documentadas |

---

## [1.1.0] - 2025-11-27

### Added
- **Project Planning Form**: `FORMULARIO_PROYECTO.md` added to all setups. Defines business problem, solution, target user, data flow, and KPIs before coding.
- **Context Engineering Integration**: Integrated core "Context Engineering" components (PRP templates, Codebase Analyst agent, `/primer` command) into the base setup.
- **Agentic Protocols**: Added "Traffic Light" protocol to `CLAUDE.md` for conditional agentic loop activation.
- **Next.js 16 Support**: Updated `auth-nextjs-template` to support Next.js 16 (Turbopack, Cache Components).

### Changed
- **Documentation Refactor**: Simplified `CLAUDE.md` across all setups (`nextjs`, `python`, `setup`) to remove meta-noise and focus on critical architecture/quality rules.
- **Template Renaming**: Renamed `plantilla-autenticacion` to `auth-nextjs-template` for consistency.
- **PRP Template**: Upgraded to a more robust version with 4 validation levels and "Known Gotchas".

### Fixed
- **Version Hallucination**: Corrected `auth-nextjs-template` package.json to match documentation (Next.js 16).

## [1.0.0] - 2025-10-01

### Added
- Initial release of SaaS Factory.
- Base templates for Next.js and Python.
- Basic agentic loop configuration.
