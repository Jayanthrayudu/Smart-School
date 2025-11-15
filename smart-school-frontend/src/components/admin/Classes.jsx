import { useEffect, useState } from 'react';
import { fetchAllClasses, createClass, deleteClass } from '../../services/classService';
import '../../styles/admin.css';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    fetchAllClasses().then(res => setClasses(res.data));
  }, []);

  const handleAddClass = async () => {
    if (!name.trim() || !section.trim() || !capacity) return;
    await createClass(name, section, parseInt(capacity));
    const updated = await fetchAllClasses();
    setClasses(updated.data);
    setName('');
    setSection('');
    setCapacity('');
  };

  const handleDeleteClass = async (id) => {
    await deleteClass(id);
    const updated = await fetchAllClasses();
    setClasses(updated.data);
  };

  return (
    <div className="admin-classes-container">
      <h2>Manage School Classes</h2>

      <div className="form-group">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Class Name (e.g., Class 1)"
        />
        <input
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder="Section (e.g., A)"
        />
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Capacity (e.g., 30)"
        />
        <button onClick={handleAddClass}>Add Class</button>
      </div>

      <ul className="class-list">
        {classes.map((cls) => (
          <li key={cls.id}>
            {cls.name} - Section {cls.section} - Capacity: {cls.capacity}
            <button className="delete-btn" onClick={() => handleDeleteClass(cls.id)}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Classes;
