'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTA() {
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
        <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <motion.div
                className="container mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2
                    className="text-3xl md:text-4xl font-bold mb-6"
                    variants={itemVariants}
                >
                    Comienza a colaborar hoy mismo
                </motion.h2>
                <motion.p
                    className="text-xl mb-8 max-w-2xl mx-auto"
                    variants={itemVariants}
                >
                    Únete a miles de equipos que ya están mejorando su productividad con team-doc.
                </motion.p>
                <motion.div variants={itemVariants}>
                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                        Prueba gratis por 14 días
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    )
}