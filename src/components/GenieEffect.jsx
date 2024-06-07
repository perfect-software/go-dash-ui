import React, { useState } from 'react';
import styles from '../styles/outlinedInput.module.css';

const GenieEffect = () => {
    const initialData = [
        { id: 1, name: 'John Doe', age: 30 },
        { id: 2, name: 'Jane Doe', age: 25 },
        { id: 3, name: 'Jim Beam', age: 40 }
    ];

    const [data, setData] = useState(initialData);
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        setDeleting(id);
        setTimeout(() => {
            setData(prevData => prevData.filter(item => item.id !== id));
            setDeleting(null);
        }, 500); 
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {data.map(row => (
                    <tr key={row.id} className={deleting === row.id ? styles.rowDeleting : ''}>
                        <td>{row.name}</td>
                        <td>{row.age}</td>
                        <td>
                            <button 
                                className={styles.deleteButton}
                                onClick={() => handleDelete(row.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default GenieEffect;
