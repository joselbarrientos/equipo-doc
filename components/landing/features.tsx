'use client'

import { motion } from 'framer-motion'
import { Edit3, Users, GitBranch, Lock } from 'lucide-react'

const features = [
    {
        icon: Edit3,
        title: 'Edición colaborativa',
        description: 'Trabaja en documentos con tu equipo en tiempo real.',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        icon: Users,
        title: 'Gestión de equipos',
        description: 'Organiza y administra fácilmente los permisos de tu equipo.',
        color: 'bg-purple-100 text-purple-600'
    },
    {
        icon: GitBranch,
        title: 'Control de versiones',
        description: 'Mantén un historial completo de cambios en tus documentos.',
        color: 'bg-green-100 text-green-600'
    },
    {
        icon: Lock,
        title: 'Seguridad avanzada',
        description: 'Protege tus documentos con encriptación de extremo a extremo.',
        color: 'bg-yellow-100 text-yellow-600'
    }
]

export function Features() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    return (
        <section id="features" className="py-20 px-4 md:px-6">
            <motion.div
                className="container mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
                    variants={itemVariants}
                >
                    Características principales
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={`flex flex-col items-center text-center p-6 rounded-lg shadow-sm ${feature.color}`}
                            variants={itemVariants}
                        >
                            <feature.icon className="h-12 w-12 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}