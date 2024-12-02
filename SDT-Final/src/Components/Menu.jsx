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
    const [showModal, setShowModal] = useState(false); // Controlar la visibilidad del modal
    const [modalType, setModalType] = useState(''); // 'add' o 'edit'

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
    
        if (!newDish.Tipo) {
            alert("Por favor, selecciona un tipo de plato.");
            return;
        }
    
        if (newDish.precio < 500) {
            alert("El valor mínimo de un plato es de $500");
            return;
        }
    
        try {
            // Obtener todos los platos del menú
            const menuSnapshot = await getDocs(collection(db, 'menu'));
            
            // Filtrar platos existentes con el mismo nombre (sin importar mayúsculas/minúsculas)
            const existingDish = menuSnapshot.docs.filter(doc => 
                doc.data().Nombre.toUpperCase() === newDish.Nombre.toUpperCase());
            
            if (existingDish.length > 0) {
                // Verificar si ya existe un plato con el mismo nombre 
                const isDuplicateNameAndDescription = existingDish.some(doc => 
                    doc.data().Nombre.toUpperCase() === newDish.Nombre.toUpperCase() && 
                    doc.data().Descripcion.toUpperCase() === newDish.Descripcion.toUpperCase());
    
                if (isDuplicateNameAndDescription) {
                    alert('Ya existe un plato con el mismo nombre y descripción.');
                    return;
                }
                
                // Verificar si ya existe un plato con el mismo nombre y descripción diferente,
                const isSameNameDifferentDescriptionOrPrice = existingDish.some(doc => 
                    doc.data().Nombre.toUpperCase() === newDish.Nombre.toUpperCase() && 
                    (doc.data().Descripcion.toUpperCase() !== newDish.Descripcion.toUpperCase() ));
    
                if (isSameNameDifferentDescriptionOrPrice) {
                    // Si pasa todas las validaciones, agregamos el plato con el mismo nombre, pero diferente descripción y precio
                    await addDoc(collection(db, 'menu'), newDish);
                    alert('Plato agregado con éxito');
                }
    
            } else {
                // Si no existe un plato con el mismo nombre, agregamos el nuevo plato
                await addDoc(collection(db, 'menu'), newDish);
                alert('Plato agregado con éxito');
            }
    
            // Limpiar el formulario y recargar la lista de platos
            setNewDish({ Nombre: '', Descripcion: '', Tipo: '', precio: '' });
            fetchMenuItems();
            setShowModal(false);
        } catch (error) {
            console.error('Error al agregar el plato: ', error);
        }
    };
    
    
    
    

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'menu', id));
        fetchMenuItems();
    };

   

    const handleUpdate = async () => {
        // Validar solo si no estamos editando
        if (!editingDish.Nombre || !editingDish.Descripcion || !editingDish.precio) {
            alert('Por favor complete todos los campos');
            return;
        }
    
        if (editingDish.precio < 500) {
            alert("El valor minimo de un plato es de $500");
            return;
        }
    
        // No es necesario validar el Tipo si ya existe en el plato que se está editando
        if (!editingDish.Tipo && modalType === 'add') {
            alert("Por favor, selecciona un tipo de plato.");
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
            setShowModal(false);
            fetchMenuItems();
        } catch (error) {
            console.error('Error al actualizar el plato: ', error);
        }
    };
    

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filteredMenuItems = menuItems.filter(item => item.Tipo === selectedCategory);


    const openModal = (type, item = null) => {
        setModalType(type);
        if (type === 'edit') setEditingDish(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingDish(null);
        setNewDish({ Nombre: '', Descripcion: '', Tipo: '', precio: '' });
    };
    
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
                                <div>
                                    <span className="menuPrice">${item.precio}</span>
                                    {role === 'admin' && (
                                    <div>
                                        <button onClick={() => handleDelete(item.id)} className="deleteButton">Eliminar</button>
                                        <button onClick={() => openModal('edit',item)} className="editButton">Editar</button>
                                    </div>
                                )}
                                </div>
                                
                                
                            </div>
                        ))}

                        {role === 'admin' && (
                            <div>
                                <button onClick={() => openModal('add')}>Agregar Plato</button>
                            </div>

                        )}
                        
                    </div>                    
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

            {showModal && (
                 <div className="modal-overlay">
                 <div className="modal-content">
                     <button className="close-button" onClick={closeModal}>
                         &times;
                     </button>
                     {modalType === 'add' ? (
                         <div>
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
                                     <option value="" disabled>Seleccione el tipo</option>
                                     <option value="Entrada">Entrada</option>
                                     <option value="Plato Principal">Plato Principal</option>
                                     <option value="Postre">Postre</option>
                                     <option value="Bebestible">Bebestible</option>
                                 </select>
                                 <input
                                     type="number"
                                     name="precio"
                                     placeholder="Precio"
                                     value={newDish.precio}
                                     min="500"
                                     onChange={(e) => {
                                         const value = e.target.value;
                                         if (/^\d*$/.test(value)) {
                                             handleInputChange(e);
                                         }
                                     }}
                                 />
                                 <button onClick={AgregarPlato}>Guardar</button>
                             </form>
                         </div>
                        ):(
                         <div>
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
                                        <option value="" disabled>Seleccione el tipo</option>
                                        <option value="Entrada">Entrada</option>
                                        <option value="Plato Principal">Plato Principal</option>
                                        <option value="Postre">Postre</option>
                                        <option value="Bebestible">Bebestible</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="precio"
                                        placeholder="Precio"
                                        value={editingDish.precio}
                                        min="500"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                handleInputChange(e);
                                            }
                                        }}
                                    />
                                    <button onClick={handleUpdate}>Guardar</button>
                                </form>
            </div>
            )}
            </div>
            </div>
            )}
        </main>
    );
}

export default Menu;
