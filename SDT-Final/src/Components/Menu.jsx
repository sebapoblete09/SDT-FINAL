import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../Firebase/firebaseconfig'; // Asegúrate de configurar la conexión a Firebase en este archivo
import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import '../styles/Menu.css';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Entrada');
    const [newDish, setNewDish] = useState({
        Nombre: '',
        Descripcion: '',
        Tipo: '', // Categoría predeterminada
        precio: '',
    });

    useEffect(() => {
        const checkAuthStatus = () => {
          const token = localStorage.getItem('token');
          const storedRole = localStorage.getItem('role'); // Obtiene el rol de localStorage
          setIsAuthenticated(!!token);
          setRole(storedRole);
        };
    
        checkAuthStatus();
      }, []);

    const [showAddForm, setShowAddForm] = useState(false); // Para mostrar el formulario de agregar plato

    // Función para obtener los platos desde Firestore
    const fetchMenuItems = async () => {
        const menuCollection = collection(db, 'menu');
        const menuSnapshot = await getDocs(menuCollection);
        const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(menuList);
    };

    // Ejecuta fetchMenuItems al cargar el componente
    useEffect(() => {
        fetchMenuItems();
    }, []);

     // Función para manejar cambios en el formulario de agregar plato
     const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDish(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Función para agregar un plato a la base de datos
    const AgregarPlato = async () => {
        if (!newDish.Nombre || !newDish.Descripcion || !newDish.precio) {
            alert('Por favor complete todos los campos');
            return;
        }

        try {
            await addDoc(collection(db, 'menu'), newDish); // Agregar el plato a la base de datos
            setNewDish({ Nombre: '', Descripcion: '', Tipo: '', precio: '' }); // Limpiar el formulario
            fetchMenuItems(); // Actualizar la lista después de agregar
            setShowAddForm(false); // Ocultar el formulario
        } catch (error) {
            console.error('Error al agregar el plato: ', error);
        }
    };

    // Función para eliminar un plato
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'menu', id));
        fetchMenuItems(); // Actualizar lista después de eliminar
    };

    // Función para cambiar la categoría
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Filtrar elementos según la categoría seleccionada
    const filteredMenuItems = menuItems.filter(item => item.Tipo === selectedCategory);

    return (
        <main className="menu-section">            
            {isAuthenticated ? (
                <>
                { /* Botones de categorías */}
                <div className="menu-buttons">
                    <button onClick={() => handleCategoryChange('Entrada')}>Entradas</button>
                    <button onClick={() => handleCategoryChange('Plato Principal')}>Plato Principal</button>
                    <button onClick={() => handleCategoryChange('Postre')}>Postres</button>
                    <button onClick={() => handleCategoryChange('Bebestible')}>Bebestibles</button>
                </div>

                {/* Mostrar ítems de la categoría seleccionada */}
                <div className="menu-items">
                    {filteredMenuItems.map((item)=>(
                        <div key={item.id} className='menuItem'>
                            <div className="menuInfo">
                                <h3 className="menuName">{item.Nombre}</h3>
                                <p className="menuDescription">{item.Descripcion}</p>
                            </div>
                            <span className="menuPrice">${item.precio}</span>

                            <div>
                            {role === 'admin' && (
                            <>
                                {/* Botón para mostrar el formulario de agregar plato */}
                            <div>
                                {/* Botones de edición y eliminación */}
                                <button onClick={() => handleDelete(item.id)} className="deleteButton">Eliminar</button>
                                <Link to={`/edit/${item.id}`} className="editButton">Editar</Link>
                            </div>
                            </>
                             )}
                            </div>
                            
                        </div>
                    ))}
                    <div>
                        <button onClick={() => setShowAddForm(true)}>Agregar Plato</button>
                    </div>
                </div>
                </>
            ):(
                <>
                { /* Botones de categorías */}
                <div className="menu-buttons">
                    <button onClick={() => handleCategoryChange('Entrada')}>Entradas</button>
                    <button onClick={() => handleCategoryChange('Plato Principal')}>Plato Principal</button>
                    <button onClick={() => handleCategoryChange('Postre')}>Postres</button>
                    <button onClick={() => handleCategoryChange('Bebestible')}>Bebestibles</button>
                </div>

                <div className="menu-items">
                    {filteredMenuItems.map((item)=>(
                        <div key={item.id} className='menuItem'>
                            <div className="menuInfo">
                                <h3 className="menuName">{item.Nombre}</h3>
                                <p className="menuDescription">{item.Descripcion}</p>
                            </div>
                            <span className="menuPrice">${item.precio}</span>
                        </div>
                    ))}
                </div>
                </>

            )}
            {/* Formulario para agregar un plato */}
            {showAddForm && (
                <div className="add-form">
                    <h3>Agregar Nuevo Plato</h3>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="text"
                            name="Nombre"
                            placeholder="Nombre del Plato"
                            value={newDish.Nombre}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="Descripcion"
                            placeholder="Descripción"
                            value={newDish.Descripcion}
                            onChange={handleInputChange}
                        />
                        <select
                            name="Tipo"
                            value={newDish.Tipo}
                            onChange={handleInputChange}
                        >
                            <option>Seleccione el tipo de entrada</option>
                            <option value="Entrada">Entrada</option>
                            <option value="Plato Principal">Plato Principal</option>
                            <option value="Postre">Postre</option>
                            <option value="Bebestible">Bebestible</option>
                        </select>
                        <label>Precio</label>
                        <input
                            type="number"
                            name="precio"
                            min="1000"
                            placeholder="Precio"
                            value={newDish.precio}
                            onChange={handleInputChange}
                        />
                        <div>
                            <button type="button" className="btns" onClick={AgregarPlato}>Agregar Plato</button>
                            <button type="button" className="btns" onClick={() => setShowAddForm(false)}>Cancelar</button>
                        </div>
                        
                    </form>
                </div>
            )}

        </main>
    );
}

export default Menu;
