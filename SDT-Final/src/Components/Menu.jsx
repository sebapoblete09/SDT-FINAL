import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Menu.css'; // Asegúrate de crear este archivo para los estilos


const menuItems = {
    entrada: [
      { name: "Caldillo de Congrio", description: "", price: "$5.000" },
      { name: "Ceviche a la Chilena", description: "", price: "$5.000" },
      { name: "Empanadas de Pino", description: "Horno y fritas.", price: "$5.000" },
      { name: "Empanadas Camarón Queso", description: "", price: "$5.000" },
      { name: "Ensalada Mixta", description: "Tomate, lechuga, repollo, cebolla", price: "$5.000" }
    ],
    platoPrincipal: [
      { name: "Pastel de Choclo", description: "", price: "$10.000" },
      { name: "Pescado Frito", description: "Agregados: arroz, papas mayos, papas fritas", price: "$10.000" },
      { name: "Costillar de Cerdo", description: "Agregados: arroz, papas mayos, papas fritas", price: "$10.000" },
      { name: "Porotos con Mazamorra", description: "", price: "$10.000" },
      { name: "Pantrucas", description: "", price: "$10.000" },
      { name: "Chorillana", description: "Incluye: vacuno, cerdo, pollo y cordero", price: "$10.000" },
      { name: "Charquicán", description: "Descripción del plato principal.", price: "$10.000" },
      { name: "Cazuela de Vacuno", description: "", price: "$10.000" }
    ],
    postre: [
      { name: "Mote con Huesillo", description: "", price: "$4.000" },
      { name: "Kuchen de Frambuesas y Arándano", description: "", price: "$4.000" },
      { name: "Helado", description: "Frutilla, piña, chocolate, mango", price: "$4.000" },
      { name: "Suspiro Limeño", description: "Descripción del postre.", price: "$4.000" }
    ],
    bebestibles: [
      { name: "Bebidas 2L", description: "Coca cola, Pepsi, Sprite, Fanta, Kem", price: "$3.000" },
      { name: "Terremoto", description: "", price: "$3.000" },
      { name: "Jugos Naturales", description: "Piña, arándanos, frambuesas, frutilla", price: "$3.000" },
      { name: "Vino", description: "Tinto o blanco", price: "$3.000" },
      { name: "Té", description: "", price: "$3.000" },
      { name: "Café", description: "Espresso, Capuccino, Mocha", price: "$3.000" }
    ]
    }

function Menu() {

    const [selectedCategory, setSelectedCategory] = useState('entrada');
    
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    }

    
  return (
    <main className="menu-section">

        {/* Botones de categorías */}
      <div className="menu-buttons">
        <button onClick={() => handleCategoryChange('entrada')}>Entradas</button>
        <button onClick={() => handleCategoryChange('platoPrincipal')}>Plato Principal</button>
        <button onClick={() => handleCategoryChange('postre')}>Postres</button>
        <button onClick={() => handleCategoryChange('bebestibles')}>Bebestibles</button>

        {/* Botón de descargar menú */}
      <div className="downloadMenu-container">
        <a href="/src/menu/Menu.pdf" download="Sabores_De_La_Tierra.pdf" className="downloadMenu" target="_blank" rel="noopener noreferrer">
          Descargar Menú
        </a>
      </div>
      </div>

      {/* Mostrar ítems de la categoría seleccionada */}
      <div className="menu-items">
        {menuItems[selectedCategory].map((item, index) => (
          <div key={index} className="menuItem">
            <div className="menuInfo">
              <h3 className="menuName">{item.name}</h3>
              <p className="menuDescription">{item.description}</p>
            </div>
            <span className="menuPrice">{item.price}</span>
          </div>
        ))}
      </div>

      
        
    </main>
  );
}

export default Menu;
