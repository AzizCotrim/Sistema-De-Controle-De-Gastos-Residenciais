import { useEffect, useState } from 'react';
import { listarCategorias } from './api/categorias';
import './App.css'

function App() {
  
  useEffect(() => {
    listarCategorias()
        .then(res => console.log(res))
        .catch(err => console.error(err))
  }, []);

  return (
    <h1> Controle de Gastos</h1>
  )
}

export default App
