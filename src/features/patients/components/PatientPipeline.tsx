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
    const [localPatients, setLocalPatients] = React.useState(patients);
    const [activeId, setActiveId] = React.useState<string | null>(null);

    React.useEffect(() => {
        setLocalPatients(patients);
    }, [patients]);

    const activePatient = activeId ? localPatients.find(p => p.id === activeId) : null;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activePatientId = active.id as string;
        const activePatient = localPatients.find(p => p.id === activePatientId);

        if (!activePatient) return;

        let newStage = COLUMNS.find(c => c.id === over.id)?.id;

        // If dropped on an item, find that item's stage
        if (!newStage) {
            const overPatient = localPatients.find(p => p.id === over.id);
            if (overPatient) {
                newStage = overPatient.pipeline_stage;
            }
        }

        if (newStage && newStage !== activePatient.pipeline_stage) {
            // Optimistic update
            const updatedPatients = localPatients.map(p =>
                p.id === activePatientId ? { ...p, pipeline_stage: newStage as Patient['pipeline_stage'] } : p
            );
            setLocalPatients(updatedPatients);

            // Trigger server action
            await updatePipelineStage(activePatientId, newStage);
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
                    const columnPatients = localPatients.filter(p => p.pipeline_stage === column.id);

                    return (
                        <div key={column.id} className="w-[350px] flex-shrink-0 flex flex-col h-full rounded-2xl bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 shadow-sm mr-4">
                            <div className={cn("p-4 border-b border-slate-100 rounded-t-2xl font-bold flex justify-between items-center", column.color)}>
                                <span>{column.title}</span>
                                <span className="bg-white/60 px-2.5 py-0.5 rounded-full text-xs shadow-sm ring-1 ring-black/5">{columnPatients.length}</span>
                            </div>

                            {/* Droppable Area */}
                            <SortableContext
                                id={column.id}
                                items={columnPatients.map(p => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex-1 p-4 overflow-y-auto min-h-[100px] scrollbar-hide pb-24" >
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
