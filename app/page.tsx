/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';

// 1. DEFINIÇÃO DE TIPO (Correção do Erro TypeScript)
// Isso ensina ao código o que é um "Cliente", para ele não se perder.
interface Cliente {
    id: string | number;
    nome: string;
    data: string;
}

export default function App() {
    // Estados do App
    // CORREÇÃO AQUI: <Cliente[]> avisa que o array vai conter Clientes, não "nada" (never).
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [novoNome, setNovoNome] = useState('');

    // 1. Carregar E CORRIGIR dados salvos ao abrir a página
    useEffect(() => {
        try {
            const dadosSalvos = localStorage.getItem('ritielle_db');
            if (dadosSalvos) {
                const listaBruta = JSON.parse(dadosSalvos);
                
                if (Array.isArray(listaBruta)) {
                    // SANITIZAÇÃO: Tipamos item como 'any' aqui para permitir a limpeza de dados antigos sujos
                    const listaCorrigida: Cliente[] = listaBruta.map((item: any, index: number) => ({
                        ...item,
                        id: item.id || `id-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                        nome: item.nome || 'Nome Indisponível',
                        data: item.data || new Date().toLocaleDateString('pt-BR')
                    }));

                    // Filtra duplicatas de ID
                    const idsVistos = new Set();
                    const listaSemDuplicatas = listaCorrigida.filter((item) => {
                        if (idsVistos.has(item.id)) {
                            item.id = `id-repaired-${Date.now()}-${Math.random()}`;
                        }
                        idsVistos.add(item.id);
                        return true;
                    });

                    setClientes(listaSemDuplicatas);
                    localStorage.setItem('ritielle_db', JSON.stringify(listaSemDuplicatas));
                }
            }
        } catch (erro) {
            console.error("Erro ao carregar dados:", erro);
            localStorage.removeItem('ritielle_db');
        }
    }, []);

    // 2. Função de Salvar
    const adicionarCliente = (e: React.FormEvent) => {
        e.preventDefault();
        if (!novoNome.trim()) return;

        const novoCliente: Cliente = {
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`,
            nome: novoNome,
            data: new Date().toLocaleDateString('pt-BR')
        };

        const novaLista = [novoCliente, ...clientes];
        
        setClientes(novaLista);
        setNovoNome('');
        
        try {
            localStorage.setItem('ritielle_db', JSON.stringify(novaLista));
        } catch (erro) {
            console.error("Erro ao salvar:", erro);
            alert("Não foi possível salvar (Armazenamento cheio ou bloqueado).");
        }
    };

    // 3. Função de Deletar
    const removerCliente = (id: string | number) => {
        const novaLista = clientes.filter(cliente => cliente.id !== id);
        setClientes(novaLista);
        try {
            localStorage.setItem('ritielle_db', JSON.stringify(novaLista));
        } catch (erro) {
            console.error("Erro ao atualizar banco:", erro);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 font-sans">
            <nav className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                        <h1 className="text-2xl font-bold text-indigo-600">Banco de dados</h1>
                    </div>
                </div>
            </nav>

            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Painel de Controle
                    </h2>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-start">
                    
                    {/* Formulário */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-50">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Novo Cliente
                            </h3>
                            
                            <form onSubmit={adicionarCliente} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        value={novoNome}
                                        onChange={(e) => setNovoNome(e.target.value)}
                                        placeholder="Ex: Ana Silva"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-gray-900"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!novoNome.trim()}
                                    className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>Salvar Localmente</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Lista */}
                    <div className="md:col-span-8">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Base de Dados (Local)
                                </h3>
                                <span className="text-sm font-medium px-3 py-1 bg-gray-200 text-gray-600 rounded-full">
                                    Total: {clientes.length}
                                </span>
                            </div>
                            
                            <div className="p-2 flex-1 overflow-y-auto max-h-[600px]">
                                {clientes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4 border-2 border-dashed border-gray-200 m-4 rounded-xl bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zM21 7.5H3" />
                                        </svg>
                                        <div className="text-center">
                                            <p className="font-medium text-gray-500">Nenhum cliente cadastrado</p>
                                            <p className="text-sm">Os dados aparecerão aqui.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {clientes.map((cliente) => (
                                            <li key={cliente.id} className="group flex justify-between items-center p-4 bg-white hover:bg-indigo-50/50 rounded-xl border border-transparent hover:border-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md mx-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                        {cliente.nome?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-lg leading-tight">
                                                            {cliente.nome || 'Nome Indisponível'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            {cliente.data || 'Data desconhecida'}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => removerCliente(cliente.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all transform hover:scale-110 focus:opacity-100"
                                                    title="Excluir Registro"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}