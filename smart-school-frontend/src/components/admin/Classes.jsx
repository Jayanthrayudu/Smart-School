import { useEffect, useState } from 'react';
import { fetchAllClasses, createClass, deleteClass } from '../../services/classService';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import '../../styles/admin.css';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [capacity, setCapacity] = useState('');

  // Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar gets open/close state and onClose */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="admin-content">
        {/* Header gets toggle function */}
        <Header onMenuClick={toggleSidebar} />

        <div className="admin-classes-container">
          <h2>Manage School Classes</h2>

          <div className="form-group">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Class Name" />
            <input value={section} onChange={e => setSection(e.target.value)} placeholder="Section" />
            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Capacity" />
            <button onClick={handleAddClass}>Add Class</button>
          </div>

          <ul className="class-list">
            {classes.map(cls => (
              <li key={cls.id}>
                {cls.name} - Section {cls.section} - Capacity: {cls.capacity}
                <button className="delete-btn" onClick={() => handleDeleteClass(cls.id)}>✖</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Classes;
