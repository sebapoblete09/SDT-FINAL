import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseconfig'; // Configuración de Firebase
import '../styles/Menu.css';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Entrada');
    const [newDish, setNewDish] = useState({
        Nombre: '',
        Descripcion: '',
        Tipo: '',
        precio: '',
    });
    const [editingDish, setEditingDish] = useState(null); // Estado para manejar la edición
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            const storedRole = localStorage.getItem('role');
            setIsAuthenticated(!!token);
            setRole(storedRole);
        };

        checkAuthStatus();
    }, []);

    const fetchMenuItems = async () => {
        const menuCollection = collection(db, 'menu');
        const menuSnapshot = await getDocs(menuCollection);
        const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(menuList);
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingDish) {
            setEditingDish(prevState => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            setNewDish(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const AgregarPlato = async () => {
        if (!newDish.Nombre || !newDish.Descripcion || !newDish.precio) {
            alert('Por favor complete todos los campos');
            return;
        }

        try {
            await addDoc(collection(db, 'menu'), newDish);
            setNewDish({ Nombre: '', Descripcion: '', Tipo: '', precio: '' });
            fetchMenuItems();
            setShowAddForm(false);
        } catch (error) {
            console.error('Error al agregar el plato: ', error);
        }
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'menu', id));
        fetchMenuItems();
    };

    const handleEditClick = (item) => {
        setEditingDish(item); // Cargar el plato en edición
    };

    const handleUpdate = async () => {
        if (!editingDish.Nombre || !editingDish.Descripcion || !editingDish.precio) {
            alert('Por favor complete todos los campos');
            return;
        }

        try {
            const docRef = doc(db, 'menu', editingDish.id);
            await updateDoc(docRef, {
                Nombre: editingDish.Nombre,
                Descripcion: editingDish.Descripcion,
                Tipo: editingDish.Tipo,
                precio: editingDish.precio,
            });
            setEditingDish(null); // Salir del modo de edición
            fetchMenuItems();
        } catch (error) {
            console.error('Error al actualizar el plato: ', error);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filteredMenuItems = menuItems.filter(item => item.Tipo === selectedCategory);

    return (
        <main className="menu-section">
            {isAuthenticated ? (
                <>
                    <div className="menu-buttons">
                        <button onClick={() => handleCategoryChange('Entrada')}>Entradas</button>
                        <button onClick={() => handleCategoryChange('Plato Principal')}>Plato Principal</button>
                        <button onClick={() => handleCategoryChange('Postre')}>Postres</button>
                        <button onClick={() => handleCategoryChange('Bebestible')}>Bebestible</button>
                    </div>

                    <div className="menu-items">
                        {filteredMenuItems.map((item) => (
                            <div key={item.id} className="menuItem">
                                <div className="menuInfo">
                                    <h3 className="menuName">{item.Nombre}</h3>
                                    <p className="menuDescription">{item.Descripcion}</p>
                                </div>
                                <span className="menuPrice">${item.precio}</span>
                                {role === 'admin' && (
                                    <div>
                                        <button onClick={() => handleDelete(item.id)} className="deleteButton">Eliminar</button>
                                        <button onClick={() => handleEditClick(item)} className="editButton">Editar</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div>
                            <button onClick={() => setShowAddForm(true)}>Agregar Plato</button>
                        </div>
                    </div>

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

                    {editingDish && (
                        <div className="edit-form">
                            <h3>Editar Plato</h3>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    name="Nombre"
                                    placeholder="Nombre del Plato"
                                    value={editingDish.Nombre}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="Descripcion"
                                    placeholder="Descripción"
                                    value={editingDish.Descripcion}
                                    onChange={handleInputChange}
                                />
                                <select
                                    name="Tipo"
                                    value={editingDish.Tipo}
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
                                    value={editingDish.precio}
                                    onChange={handleInputChange}
                                />
                                <div>
                                    <button type="button" className="btns" onClick={handleUpdate}>Guardar Cambios</button>
                                    <button type="button" className="btns" onClick={() => setEditingDish(null)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="menu-buttons">
                        <button onClick={() => handleCategoryChange('Entrada')}>Entradas</button>
                        <button onClick={() => handleCategoryChange('Plato Principal')}>Plato Principal</button>
                        <button onClick={() => handleCategoryChange('Postre')}>Postres</button>
                        <button onClick={() => handleCategoryChange('Bebestible')}>Bebestibles</button>
                    </div>

                    <div className="menu-items">
                        {filteredMenuItems.map((item) => (
                            <div key={item.id} className="menuItem">
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
        </main>
    );
}

export default Menu;
