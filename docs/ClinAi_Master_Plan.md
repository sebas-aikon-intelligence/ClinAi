# ClinAi - Plan de Trabajo Completo
IMPORTANTE: Este documento es la fuente de verdad del proyecto. Cada tarea debe completarse, verificarse y aprobarse antes de pasar a la siguiente.

## PRD (Product Requirements Document)
### Vision General
ClinAi es un SaaS de gestion clinica con estetica Glassmorphism avanzado inspirado en Salesforce/SugarCRM.

### Caracteristicas de Diseno:
- Contenedores "Bento Box" con bordes redondeados (32px) y backdrop-filter: blur(20px)
- Paleta: Fondo degradado gris claro a blanco perla, acentos Azul Electrico (#3B82F6), Amarillo Neon (#EAB308), Negro (#000000)
- Header minimalista con opcion activa en fondo negro redondeado
- Sombras "Soft Shadows" de gran radio y baja opacidad

### Stack Tecnologico
- Framework: Next.js 16 + React 19 + TypeScript
- Estilos: Tailwind CSS 3.4
- Backend: Supabase (Auth + PostgreSQL + Storage + Realtime)
- Automaciones: n8n (webhooks, envio de mensajes)
- Deploy: Vercel

### Modulos del Sistema
A. Dashboard (Analytics & Command Center)
- KPIs: Revenue, Nuevos Clientes, Tareas del dia
- Pipeline visual con cards de colores
- AI Sidebar flotante para comandos

B. CRM / Pacientes (Ficha 360)
- Detalle con foto, Quick Actions (WhatsApp, Email, Llamada, Agendar)
- Vistas: Galeria, Pipeline/Kanban
- Media Vault: Comparador Antes/Despues
- Tabs: Timeline, Archivos, Recetas

C. Mensajeria (Omnicanal)
- Canales: Telegram, WhatsApp, Instagram, Email
- Filtros por canal y etiquetas
- Indicador IA vs Humano
- Plantillas predeterminadas
- Envio de texto, audio, archivos via n8n

D. Calendario
- Vista multi-especialista (dia, semana, mes)
- Editable con drag-and-drop
- Datos en Supabase (tabla appointments)
- Nota: El agente n8n sincroniza citas a Google Calendar automaticamente

E. Finanzas
- Ingresos totales por producto/fecha/cliente
- Reportes filtrados

F. Configuracion
- Perfil de usuario
- Gestion de equipo
- Plantillas de mensajes
- Gestion de etiquetas

### Estado Actual del Proyecto
| Modulo | Estado | Notas |
| :--- | :--- | :--- |
| Dashboard | 60% | KPIs funcionales, ingresos mockeados |
| Pacientes | 30% | Solo listado basico |
| Calendario | 20% | Solo diseno, sin BD |
| Mensajes | 80% | Telegram funcional con n8n |
| Finanzas | 20% | Mockup estatico |
| Inventario | 20% | A ELIMINAR |
| Tareas | 70% | Server Actions listos |
| Configuracion | 0% | No existe |

## FASES DE IMPLEMENTACION

### FASE 0: Limpieza y Navegacion Base
Objetivo: Actualizar Sidebar, eliminar Inventario, crear rutas base

**Tareas**
- 0.1 Modificar Sidebar: quitar Inventario, agregar Tareas y Configuracion
  - Archivo: src/components/layout/Sidebar.tsx
  - Criterio: Menu muestra Dashboard, Pacientes, Calendario, Mensajes, Finanzas, Tareas, Configuracion
- 0.2 Eliminar carpeta de Inventario
  - Eliminar: src/app/(main)/dashboard/inventory/
  - Criterio: Ruta /dashboard/inventory retorna 404
- 0.3 Crear pagina de Tareas
  - Crear: src/app/(main)/dashboard/tasks/page.tsx
  - Criterio: Ruta /dashboard/tasks carga correctamente
- 0.4 Crear estructura base de Configuracion
  - Crear: src/app/(main)/settings/layout.tsx
  - Crear: src/app/(main)/settings/page.tsx
  - Crear: src/app/(main)/settings/profile/page.tsx
  - Crear: src/app/(main)/settings/team/page.tsx
  - Crear: src/app/(main)/settings/templates/page.tsx
  - Crear: src/app/(main)/settings/tags/page.tsx
  - Criterio: Todas las rutas cargan con placeholder
- 0.5 Verificar navegacion completa
  - Criterio: Todas las rutas del Sidebar funcionan sin errores
- 0.6 Commit: "feat: update navigation - remove inventory, add tasks and settings"

### FASE 1: Sistema de Etiquetas (Tags)
Objetivo: Crear infraestructura de etiquetas reutilizable

**Modelo de Datos**
```sql
-- Tabla de etiquetas
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366F1',
  type VARCHAR(20) DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relacion pacientes-etiquetas
CREATE TABLE patient_tags (
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (patient_id, tag_id)
);

-- RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_tags ENABLE ROW LEVEL SECURITY;
```

**Tareas**
- 1.1 Crear migracion SQL para tablas tags y patient_tags
  - Ejecutar en Supabase Dashboard o via MCP
  - Criterio: Tablas creadas con RLS habilitado
- 1.2 Crear tipos TypeScript
  - Crear: src/features/tags/types/index.ts
  - Criterio: Interfaces Tag, PatientTag exportadas
- 1.3 Crear Server Actions para tags
  - Crear: src/features/tags/actions/tagActions.ts
  - Funciones: getTags, createTag, updateTag, deleteTag, assignTagToPatient, removeTagFromPatient
  - Criterio: CRUD funcional
- 1.4 Crear hook useTags
  - Crear: src/features/tags/hooks/useTags.ts
  - Criterio: Hook retorna tags con loading state
- 1.5 Crear componente TagBadge
  - Crear: src/features/tags/components/TagBadge.tsx
  - Criterio: Muestra etiqueta con color dinamico
- 1.6 Crear componente TagSelector
  - Crear: src/features/tags/components/TagSelector.tsx
  - Criterio: Dropdown para seleccionar/crear etiquetas
- 1.7 Crear componente TagManager
  - Crear: src/features/tags/components/TagManager.tsx
  - Criterio: CRUD visual de etiquetas
- 1.8 Integrar TagManager en Settings/Tags
  - Modificar: src/app/(main)/settings/tags/page.tsx
  - Criterio: Gestion completa de etiquetas funcional
- 1.9 Verificar sistema de etiquetas end-to-end
  - Criterio: Crear, editar, eliminar etiquetas funciona
- 1.10 Commit: "feat: implement tag system with CRUD and components"

### FASE 2: Pacientes - Modelo de Datos Extendido
Objetivo: Extender modelo de pacientes para Ficha 360

**Modelo de Datos**
```sql
-- Extender tabla patients
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS pipeline_stage VARCHAR(20) DEFAULT 'lead';

-- Archivos del paciente
CREATE TABLE patient_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recetas medicas
CREATE TABLE patient_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  medication TEXT NOT NULL,
  dosage VARCHAR(100),
  instructions TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_via VARCHAR(20)
);

-- Timeline de actividades
CREATE TABLE patient_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para todas las tablas
ALTER TABLE patient_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_activities ENABLE ROW LEVEL SECURITY;
```

**Tareas**
- 2.1 Ejecutar migracion para extender patients
  - Criterio: Columnas email, phone, address, birth_date, pipeline_stage agregadas
- 2.2 Crear tabla patient_files
  - Criterio: Tabla creada con RLS
- 2.3 Crear tabla patient_prescriptions
  - Criterio: Tabla creada con RLS
- 2.4 Crear tabla patient_activities
  - Criterio: Tabla creada con RLS
- 2.5 Configurar Supabase Storage bucket para archivos
  - Crear bucket: patient-files
  - Criterio: Bucket creado con politicas de acceso
- 2.6 Crear tipos TypeScript extendidos
  - Crear: src/features/patients/types/index.ts
  - Criterio: Patient, PatientFile, Prescription, Activity tipados
- 2.7 Crear Server Actions completos
  - Crear: src/features/patients/actions/patientActions.ts
  - Funciones: getPatients, getPatientById, createPatient, updatePatient, deletePatient
  - Funciones: getPatientFiles, uploadFile, deleteFile
  - Funciones: getPrescriptions, createPrescription, sendPrescription
  - Funciones: getActivities, createActivity
  - Funciones: updatePipelineStage
  - Criterio: Todas las funciones implementadas
- 2.8 Verificar modelo de datos end-to-end
  - Criterio: Queries a todas las tablas funcionan
- 2.9 Commit: "feat: extend patient data model with files, prescriptions, activities"

### FASE 3: Pacientes - UI Completa
Objetivo: Implementar vistas galeria, kanban y detalle 360

**Tareas**
- 3.1 Crear componente PatientCard
  - Crear: src/features/patients/components/PatientCard.tsx
  - Incluye: Foto, nombre, etiquetas, pipeline stage, quick actions
  - Criterio: Card renderiza correctamente
- 3.2 Crear vista PatientGallery
  - Crear: src/features/patients/components/PatientGallery.tsx
  - Criterio: Grid de PatientCards con busqueda
- 3.3 Instalar dependencia drag-and-drop
  - Ejecutar: npm install @dnd-kit/core @dnd-kit/sortable
  - Criterio: Dependencia instalada
- 3.4 Crear vista PatientPipeline (Kanban)
  - Crear: src/features/patients/components/PatientPipeline.tsx
  - Columnas: Lead, Contactado, Agendado, Activo, Inactivo
  - Criterio: Drag-and-drop entre columnas funciona
- 3.5 Crear componente QuickActions
  - Crear: src/features/patients/components/QuickActions.tsx
  - Botones: WhatsApp, Email, Llamada, Agendar
  - Criterio: Botones abren acciones correspondientes
- 3.6 Crear componente PatientTimeline
  - Crear: src/features/patients/components/PatientTimeline.tsx
  - Criterio: Lista cronologica de actividades
- 3.7 Crear componente PatientFiles
  - Crear: src/features/patients/components/PatientFiles.tsx
  - Incluye: Upload, preview, delete
  - Criterio: Gestion de archivos funcional
- 3.8 Crear componente PatientPrescriptions
  - Crear: src/features/patients/components/PatientPrescriptions.tsx
  - Incluye: Crear receta, enviar por email/whatsapp via n8n
  - Criterio: CRUD y envio funcionan
- 3.9 Crear componente PatientDetail
  - Crear: src/features/patients/components/PatientDetail.tsx
  - Incluye: Header con info, QuickActions, TagSelector, Tabs
  - Criterio: Ficha 360 completa
- 3.10 Crear ruta dinamica de detalle
  - Crear: src/app/(main)/dashboard/patients/[id]/page.tsx
  - Criterio: Ruta /dashboard/patients/[id] carga PatientDetail
- 3.11 Crear modal CreatePatientModal
  - Crear: src/features/patients/components/CreatePatientModal.tsx
  - Criterio: Formulario de creacion funcional
- 3.12 Actualizar pagina principal de pacientes
  - Modificar: src/app/(main)/dashboard/patients/page.tsx
  - Incluye: Toggle entre vista Galeria y Pipeline, boton crear
  - Criterio: Ambas vistas funcionan
- 3.13 Integrar servicio n8n para envio de recetas
  - Crear: src/features/patients/services/prescriptionService.ts
  - Webhook: /webhook/send-prescription
  - Criterio: Envio por email/whatsapp funciona
- 3.14 Verificar modulo pacientes end-to-end
  - Criterio: Crear paciente, asignar tags, subir archivo, crear receta, enviar
- 3.15 Commit: "feat: complete patient module with gallery, pipeline and 360 detail"

### FASE 4: Calendario Funcional
Objetivo: Calendario editable con vistas dia/semana/mes

**Tareas**
- 4.1 Instalar FullCalendar
  - Ejecutar: npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
  - Criterio: Dependencias instaladas
- 4.2 Crear tipos de calendario
  - Crear: src/features/calendar/types/index.ts
  - Criterio: Appointment, CalendarEvent tipados
- 4.3 Crear hook useAppointments
  - Crear: src/features/calendar/hooks/useAppointments.ts
  - Incluye: Realtime subscription
  - Criterio: Citas se cargan y actualizan en tiempo real
- 4.4 Crear Server Actions de citas
  - Crear: src/features/calendar/actions/appointmentActions.ts
  - Funciones: getAppointments, createAppointment, updateAppointment, deleteAppointment
  - Criterio: CRUD completo
- 4.5 Crear componente ClinicCalendar
  - Crear: src/features/calendar/components/ClinicCalendar.tsx
  - Incluye: Vistas dia/semana/mes, drag-and-drop, click para editar
  - Criterio: Calendario interactivo funciona
- 4.6 Crear componente AppointmentModal
  - Crear: src/features/calendar/components/AppointmentModal.tsx
  - Incluye: Ver/editar detalles de cita
  - Criterio: Modal muestra y permite editar cita
- 4.7 Crear componente CreateAppointmentModal
  - Crear: src/features/calendar/components/CreateAppointmentModal.tsx
  - Incluye: Seleccionar paciente, especialista, hora
  - Criterio: Creacion de citas funcional
- 4.8 Actualizar pagina de calendario
  - Modificar: src/app/(main)/dashboard/calendar/page.tsx
  - Incluye: Titulo, selector de vista, boton nueva cita
  - Criterio: Pagina completa y funcional
- 4.9 (Opcional) Configurar Google Calendar OAuth
  - Crear: src/app/api/calendar/google/route.ts
  - Crear: src/features/calendar/services/googleCalendarService.ts
  - Criterio: Sincronizacion bidireccional
- 4.10 Verificar calendario end-to-end
  - Criterio: Crear, mover, editar, eliminar citas
- 4.11 Commit: "feat: implement full calendar with day/week/month views"

### FASE 5: Configuracion n8n Multi-Canal
Objetivo: Configurar workflows de n8n para WhatsApp, Instagram y Email

**Tareas**
- 5.1 Documentar estructura de workflows n8n existentes
  - Revisar: Workflow de Telegram actual
  - Criterio: Entender patron de integracion actual
- 5.2 Crear workflow n8n para WhatsApp
  - Webhook: /webhook/whatsapp-incoming
  - Webhook: /webhook/whatsapp-send
  - Criterio: Recibir y enviar mensajes WhatsApp
- 5.3 Crear workflow n8n para Instagram
  - Webhook: /webhook/instagram-incoming
  - Webhook: /webhook/instagram-send
  - Criterio: Recibir y enviar mensajes Instagram
- 5.4 Crear workflow n8n para Email
  - Webhook: /webhook/email-send
  - Criterio: Enviar emails desde la app
- 5.5 Crear workflow n8n para recetas
  - Webhook: /webhook/send-prescription
  - Soporta: email y whatsapp
  - Criterio: Envio de recetas funcional
- 5.6 Crear workflow n8n para agendar citas en Google Calendar
  - Webhook: /webhook/create-appointment
  - Criterio: Citas creadas se sincronizan a Google Calendar
- 5.7 Documentar todos los webhooks en el plan
  - Criterio: Documentacion completa de endpoints
- 5.8 Commit: "feat: configure n8n workflows for multi-channel messaging"

### FASE 6: Mensajes Estilo ManyChat (Depende de Fase 5)
Objetivo: Multi-canal con filtros, plantillas e indicador IA/Humano

**Modelo de Datos**
```sql
-- Plantillas de mensajes
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  channel VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extender conversaciones
ALTER TABLE telegram_conversations
  ADD COLUMN IF NOT EXISTS channel VARCHAR(20) DEFAULT 'telegram';

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
```

**Tareas**
- 6.1 Crear tabla message_templates
  - Criterio: Tabla creada con RLS
- 6.2 Extender telegram_conversations con channel
  - Criterio: Columna channel agregada
- 6.3 Actualizar tipos de mensajes
  - Modificar: src/features/messages/types/index.ts
  - Agregar: MessageTemplate, canales multiples
  - Criterio: Tipos actualizados
- 6.4 Crear componente ChannelFilter
  - Crear: src/features/messages/components/ChannelFilter.tsx
  - Canales: Telegram, WhatsApp, Instagram, Email
  - Criterio: Filtrado por canal funciona
- 6.5 Crear componente ConversationTagFilter
  - Crear: src/features/messages/components/ConversationTagFilter.tsx
  - Criterio: Filtrado por etiquetas funciona
- 6.6 Actualizar MessageBubble con indicador IA/Humano
  - Modificar o crear: src/features/messages/components/MessageBubble.tsx
  - Criterio: Icono/badge indica si mensaje fue de IA o humano
- 6.7 Crear componente TemplatesPanel
  - Crear: src/features/messages/components/TemplatesPanel.tsx
  - Incluye: Lista de plantillas, insertar en chat
  - Criterio: Plantillas se pueden usar
- 6.8 Crear Server Actions para plantillas
  - Crear: src/features/messages/actions/templateActions.ts
  - Funciones: getTemplates, createTemplate, updateTemplate, deleteTemplate
  - Criterio: CRUD funcional
- 6.9 Crear componente AttachmentButton
  - Crear: src/features/messages/components/AttachmentButton.tsx
  - Tipos: Texto, Audio, Archivo
  - Criterio: Seleccion de tipo de mensaje
- 6.10 Actualizar servicio multicanal
  - Crear: src/features/messages/services/multiChannelService.ts
  - Webhooks n8n segun tipo de contenido
  - Criterio: Envio por tipo funciona
- 6.11 Redisenar pagina de mensajes
  - Modificar: src/app/(main)/dashboard/messages/page.tsx
  - Layout: Sidebar filtros, lista conversaciones, chat principal
  - Criterio: UI estilo ManyChat
- 6.12 Verificar mensajeria end-to-end
  - Criterio: Filtrar, enviar texto/audio/archivo, usar plantillas
- 6.13 Commit: "feat: implement ManyChat-style messaging with multi-channel support"

### FASE 7: Finanzas con Datos Reales
Objetivo: Conectar finanzas a BD con reportes filtrados

**Modelo de Datos**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(10) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  patient_id UUID REFERENCES patients(id),
  product_service VARCHAR(100),
  payment_method VARCHAR(30),
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
```

**Tareas**
- 7.1 Crear tabla transactions
  - Criterio: Tabla creada con RLS
- 7.2 Crear tipos de finanzas
  - Crear: src/features/finance/types/index.ts
  - Criterio: Transaction, FinanceStats tipados
- 7.3 Crear Server Actions de finanzas
  - Crear: src/features/finance/actions/financeActions.ts
  - Funciones: getTransactions, createTransaction, getStats, getRevenueByPatient, getRevenueByProduct
  - Criterio: Funciones implementadas
- 7.4 Crear hook useFinanceStats
  - Crear: src/features/finance/hooks/useFinanceStats.ts
  - Criterio: Hook retorna estadisticas agregadas
- 7.5 Crear componente FinanceFilters
  - Crear: src/features/finance/components/FinanceFilters.tsx
  - Filtros: Fecha, paciente, producto/servicio
  - Criterio: Filtrado funciona
- 7.6 Actualizar RevenueChart con datos reales
  - Modificar: src/features/finance/components/RevenueChart.tsx
  - Criterio: Grafico muestra datos de BD
- 7.7 Crear componente TransactionsTable
  - Crear: src/features/finance/components/TransactionsTable.tsx
  - Criterio: Tabla con paginacion y filtros
- 7.8 Crear modal CreateTransactionModal
  - Crear: src/features/finance/components/CreateTransactionModal.tsx
  - Criterio: Crear ingreso/egreso funcional
- 7.9 Actualizar pagina de finanzas
  - Modificar: src/app/(main)/dashboard/finance/page.tsx
  - Criterio: KPIs reales, filtros, tabla, graficos
- 7.10 Verificar finanzas end-to-end
  - Criterio: Crear transaccion, filtrar, ver reportes
- 7.11 Commit: "feat: implement finance module with real data and reports"

### FASE 8: Configuracion Completa
Objetivo: Perfil, equipo, plantillas, etiquetas

**Tareas**
- 8.1 Crear layout de settings
  - Modificar: src/app/(main)/settings/layout.tsx
  - Incluye: Sidebar de navegacion de settings
  - Criterio: Navegacion lateral funciona
- 8.2 Crear componente ProfileForm
  - Crear: src/features/settings/components/ProfileForm.tsx
  - Campos: Nombre, email, avatar, etc.
  - Criterio: Edicion de perfil funciona
- 8.3 Implementar pagina de perfil
  - Modificar: src/app/(main)/settings/profile/page.tsx
  - Criterio: Perfil editable
- 8.4 Crear componente TeamManagement
  - Crear: src/features/settings/components/TeamManagement.tsx
  - Incluye: Lista de miembros, roles
  - Criterio: Ver equipo funciona
- 8.5 Crear modal InviteMemberModal
  - Crear: src/features/settings/components/InviteMemberModal.tsx
  - Criterio: Invitar por email funciona
- 8.6 Implementar pagina de equipo
  - Modificar: src/app/(main)/settings/team/page.tsx
  - Criterio: Gestion de equipo funcional
- 8.7 Implementar pagina de plantillas
  - Modificar: src/app/(main)/settings/templates/page.tsx
  - Reutiliza: TemplatesPanel de mensajes
  - Criterio: CRUD de plantillas
- 8.8 Verificar pagina de etiquetas
  - Ya implementada en Fase 1
  - Criterio: TagManager funciona
- 8.9 Verificar configuracion end-to-end
  - Criterio: Todas las secciones funcionales
- 8.10 Commit: "feat: implement settings module with profile, team and templates"

### FASE 9: Validacion Final y Polish
Objetivo: Testing, optimizacion, documentacion

**Tareas**
- 9.1 Ejecutar typecheck
  - Comando: npm run typecheck
  - Criterio: 0 errores de tipos
- 9.2 Ejecutar lint
  - Comando: npm run lint
  - Criterio: 0 errores de lint
- 9.3 Ejecutar build de produccion
  - Comando: npm run build
  - Criterio: Build exitoso
- 9.4 Testing manual de flujos criticos
  - Flujos: Login, crear paciente, agendar cita, enviar mensaje, registrar pago
  - Criterio: Todos los flujos funcionan
- 9.5 Optimizacion de performance
  - Revisar: Lazy loading de componentes pesados
  - Revisar: Caching de queries frecuentes
  - Criterio: Paginas cargan en < 3 segundos
- 9.6 Actualizar documentacion
  - Actualizar: README.md con nuevas features
  - Crear: Documentacion de endpoints n8n
  - Criterio: Documentacion completa
- 9.7 Documentar errores en Auto-Blindaje
  - Actualizar: CLAUDE.md con aprendizajes
  - Criterio: Errores encontrados documentados
- 9.8 Deploy a Vercel
  - Criterio: App funciona en produccion
- 9.9 Commit final: "feat: ClinAi v1.0 - complete clinical management platform"

## Webhooks n8n Requeridos
| Webhook | Proposito | Payload |
| :--- | :--- | :--- |
| /webhook/telegram-manual-send | Enviar mensaje Telegram | { chat_id, message, sender_type } |
| /webhook/telegram-incoming | Recibir mensaje Telegram | Ya configurado |
| /webhook/whatsapp-send | Enviar mensaje WhatsApp | { phone, message, type, media_url? } |
| /webhook/whatsapp-incoming | Recibir mensaje WhatsApp | Configurar en Fase 5 |
| /webhook/instagram-send | Enviar mensaje Instagram | { user_id, message, type } |
| /webhook/instagram-incoming | Recibir mensaje Instagram | Configurar en Fase 5 |
| /webhook/email-send | Enviar email | { to, subject, body, attachments? } |
| /webhook/send-prescription | Enviar receta | { patient_id, prescription_id, channel, recipient } |
| /webhook/create-appointment | Crear cita en Google Calendar | { patient_id, datetime, specialist, notes } |
| /webhook/update-appointment | Actualizar cita en Google Calendar | { appointment_id, datetime?, notes? } |

## Notas de Implementacion
- FullCalendar SSR: Usar dynamic import con ssr: false
- Supabase Realtime: Reutilizar patron de useConversations
- File uploads: Usar Supabase Storage con bucket patient-files
- Drag-and-drop: Usar @dnd-kit/core para Kanban
- n8n Headers: Siempre incluir X-N8N-API-KEY en requests
- Google Calendar: Solo el agente n8n sincroniza a GCal, no la app directamente
- Diseno UI: Esperando imagenes de referencia del usuario para ajustar estilos

## Dependencias a Instalar
```bash
# Calendario
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# Drag and Drop (Kanban)
npm install @dnd-kit/core @dnd-kit/sortable
```
