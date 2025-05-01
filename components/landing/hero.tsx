'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

export function Hero() {
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
        <section className="py-20 px-4 md:px-6">
            <motion.div
                className="container mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                    variants={itemVariants}
                >
                    Colabora y crea documentos en equipo
                </motion.h1>
                <motion.p
                    className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
                    variants={itemVariants}
                >
                    team-doc te permite crear, editar y compartir documentos con tu equipo en tiempo real.
                </motion.p>
                <motion.div variants={itemVariants}>
                    <Button size="lg" className="mr-4 bg-blue-600 hover:bg-blue-700 text-white">
                        Comenzar gratis
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        Ver demo
                    </Button>
                </motion.div>
                <motion.ul
                    className="mt-12 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8"
                    variants={containerVariants}
                >
                    {['Colaboración en tiempo real', 'Edición de Markdown', 'Control de versiones'].map((feature, index) => (
                        <motion.li
                            key={index}
                            className="flex items-center text-lg text-gray-700"
                            variants={itemVariants}
                        >
                            <Check className="mr-2 h-5 w-5 text-green-500" />
                            {feature}
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.div>
        </section>
    )
}