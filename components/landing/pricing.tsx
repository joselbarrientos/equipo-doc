'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
    {
        name: 'Básico',
        price: '9.99',
        features: ['5 usuarios', '10 GB de almacenamiento', 'Soporte por email'],
        color: 'bg-blue-50 border-blue-200'
    },
    {
        name: 'Pro',
        price: '19.99',
        features: ['Usuarios ilimitados', '100 GB de almacenamiento', 'Soporte prioritario'],
        color: 'bg-purple-50 border-purple-200'
    },
    {
        name: 'Empresa',
        price: 'Personalizado',
        features: ['Características personalizadas', 'Almacenamiento ilimitado', 'Soporte dedicado'],
        color: 'bg-green-50 border-green-200'
    }
]

export function Pricing() {
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
        <section id="pricing" className="py-20 px-4 md:px-6">
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
                    Planes y precios
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            className={`flex flex-col p-6 rounded-lg shadow-sm ${plan.color} border`}
                            variants={itemVariants}
                        >
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">{plan.name}</h3>
                            <p className="text-3xl font-bold mb-6 text-gray-900">
                                {typeof plan.price === 'string' ? `$${plan.price}` : plan.price}
                                {typeof plan.price === 'string' && <span className="text-sm font-normal text-gray-600">/mes</span>}
                            </p>
                            <ul className="mb-6 flex-grow">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center mb-2 text-gray-700">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                {plan.name === 'Empresa' ? 'Contactar' : 'Comenzar'}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}