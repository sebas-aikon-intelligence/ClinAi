'use client';

import React from 'react';
import { Patient } from '../types';
import { PatientCard } from './PatientCard';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, closestCenter, defaultDropAnimationSideEffects, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updatePipelineStage } from '../actions/patientActions';
import { cn } from '@/lib/utils';

interface PatientPipelineProps {
    patients: Patient[];
}

const COLUMNS = [
    { id: 'lead', title: 'Lead', color: 'bg-blue-50 border-blue-100 text-blue-700' },
    { id: 'contacted', title: 'Contactado', color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
    { id: 'scheduled', title: 'Agendado', color: 'bg-purple-50 border-purple-100 text-purple-700' },
    { id: 'active', title: 'Activo', color: 'bg-green-50 border-green-100 text-green-700' },
    { id: 'inactive', title: 'Inactivo', color: 'bg-slate-50 border-slate-100 text-slate-700' },
];

function SortablePatient({ patient }: { patient: Patient }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: patient.id, data: { patient } }); // Pass data so we can use it in overlay

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 touch-none">
            <PatientCard patient={patient} className="cursor-grab active:cursor-grabbing hover:shadow-md hover:scale-100" />
        </div>
    );
}

export function PatientPipeline({ patients }: PatientPipelineProps) {
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [activePatient, setActivePatient] = React.useState<Patient | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        setActivePatient(event.active.data.current?.patient || patients.find(p => p.id === event.active.id));
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActivePatient(null);

        if (over && active.id !== over.id) {
            // Find which column we dropped into
            // The over.id could be a column OR another item
            // If it's a column, we update to that column
            // If it's an item, we update to that item's column (but sorting logic is mocked here primarily just for stage change)

            let newStage = COLUMNS.find(c => c.id === over.id)?.id;

            // If dropped on an item, find that item's stage
            if (!newStage) {
                const overPatient = patients.find(p => p.id === over.id);
                if (overPatient) {
                    newStage = overPatient.pipeline_stage;
                }
            }

            if (newStage && newStage !== active.data.current?.patient?.pipeline_stage) {
                // Optimistic update or just trigger server action
                // For now, trigger action and let Revalidation handle UI
                await updatePipelineStage(active.id as string, newStage);
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full overflow-x-auto pb-4 gap-6 px-1">
                {COLUMNS.map(column => {
                    const columnPatients = patients.filter(p => p.pipeline_stage === column.id);

                    return (
                        <div key={column.id} className="w-80 flex-shrink-0 flex flex-col h-full rounded-2xl bg-white/40 backdrop-blur-sm border border-white/40 shadow-sm">
                            <div className={cn("p-4 border-b rounded-t-2xl font-bold flex justify-between items-center", column.color)}>
                                <span>{column.title}</span>
                                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">{columnPatients.length}</span>
                            </div>

                            {/* Droppable Area */}
                            {/* We use the column ID as a droppable zone if empty, but SortableContext mainly handles sorting */}
                            <SortableContext
                                id={column.id}
                                items={columnPatients.map(p => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex-1 p-3 overflow-y-auto min-h-[100px]" >
                                    {/* Note: In dnd-kit, if a list is empty, we need a droppable area for the container. 
                        SortableContext doesn't automatically make the container dropable if items are empty.
                        Simplification: Assuming we drop ON the container id if items are empty is handled by logic above.
                        Wait, we need to register the column as a droppable if we want to drop into empty columns.
                        My handleDragEnd logic handles dropping on 'over.id' which could be column id if I make it droppable.
                        But SortableContext handles items.
                        I'll wrap this div in a Droppable if I had one, but for simplicity I relies on dropping on items or generic handling.
                        Actually, dropping on empty lists is tricky with just SortableContext. 
                        I'll rely on the logic finding the column if dropped "near" it or just skip empty list drop for this MVP step 
                        UNLESS I add a useDroppable hook for the column.
                        Let's add useDroppable for column to be safe.
                    */}
                                    <DroppableColumn id={column.id}>
                                        {columnPatients.map(patient => (
                                            <SortablePatient key={patient.id} patient={patient} />
                                        ))}
                                    </DroppableColumn>
                                </div>
                            </SortableContext>
                        </div>
                    );
                })}
            </div>
            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: { opacity: '0.4' },
                    },
                }),
            }}>
                {activePatient ? <PatientCard patient={activePatient} /> : null}
            </DragOverlay>
        </DndContext>
    );
}

// Helper for droppable column
import { useDroppable } from '@dnd-kit/core';

function DroppableColumn({ id, children }: { id: string, children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className="h-full min-h-[200px]">
            {children}
        </div>
    );
}
