import React, { useState, useEffect } from 'react';

function App() {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [editId, setEditId] = useState(null); // Şu an hangi ID düzenleniyor?
  const [editText, setEditText] = useState(""); // Düzenlenen metin ne?

  // --- LOCALSTORAGE (VERİ ÇEKME) ---
  const [list, setList] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // --- LOCALSTORAGE (KAYDETME) ---
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(list));
  }, [list]);

  // --- İLERLEME ÇUBUĞU ---
  const completedCount = list.filter(t => t.isCompleted).length;
  const totalTasks = list.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  // --- EKLEME FONKSİYONU ---
  const addTask = () => {
    if (text.trim() === "") return;
    const newTask = {
      id: Date.now(),
      content: text,
      isCompleted: false,
      createdAt: new Date().toLocaleDateString('tr-TR') // Tarih Eklendi
    };
    setList([...list, newTask]);
    setText("");
  };

  // --- SİLME FONKSİYONU ---
  const deleteTask = (id) => {
    setList(list.filter(task => task.id !== id));
  };

  // --- TAMAMLANDI İŞARETLEME ---
  const toggleComplete = (id) => {
    setList(list.map(task => {
      if (task.id === id) return { ...task, isCompleted: !task.isCompleted };
      return task;
    }));
  };

  // --- DÜZENLEME (EDIT) BAŞLATMA ---
  const startEdit = (task) => {
    setEditId(task.id);      // Hangi görevi düzenliyoruz?
    setEditText(task.content); // Kutucuğa mevcut yazıyı getir
  };

  // --- DÜZENLEMEYİ KAYDETME ---
  const saveEdit = (id) => {
    setList(list.map(task => {
      if (task.id === id) return { ...task, content: editText };
      return task;
    }));
    setEditId(null); // Düzenleme modundan çık
    setEditText("");
  };

  // --- TEMİZLEME ---
  const clearAll = () => {
    if (window.confirm("Are you sure?")) setList([]);
  };

  // --- FİLTRELEME MANTIĞI (ÖNEMLİ) ---
  const filteredList = list.filter(task => {
    if (filter === 'completed') return task.isCompleted;
    if (filter === 'active') return !task.isCompleted;
    return true; // 'all' ise hepsini göster
  });

  return (
    <div style={{ 
      width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', paddingTop: '50px', backgroundColor: '#000000', fontFamily: 'Arial, sans-serif' 
    }}>
      
      <h1 style={{ color: '#ffffff', marginBottom: '20px' }}>To-Do List </h1>
      
      {/* PROGRESS BAR */}
      {totalTasks > 0 && (
        <div style={{ width: '300px', marginBottom: '20px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#20d34a', transition: 'width 0.5s' }}></div>
          </div>
        </div>
      )}

      {/* INPUT ALANI */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {list.length > 0 && (
          <button onClick={clearAll} style={{ backgroundColor: '#333', color: '#ff4444', border: '1px solid #ff4444', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Clear</button>
        )}
        <input 
          type="text" placeholder="Add a new task..." value={text} onChange={(e) => setText(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          style={{ padding: '10px', width: '220px', borderRadius: '8px', border: 'none', outline: 'none' }}
        />
        <button onClick={addTask} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Add</button>
      </div>

      {/* --- FİLTRE BUTONLARI (YENİ) --- */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['all', 'active', 'completed'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
              backgroundColor: filter === f ? 'white' : '#333',
              color: filter === f ? 'black' : 'white',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LİSTE */}
      <ul style={{ listStyle: 'none', padding: 0, width: '100%', maxWidth: '450px' }}>
         {filteredList.length === 0 && <p style={{color: '#666', textAlign: 'center'}}>No tasks found.</p>}
         
         {filteredList.map((task) => (
           <li key={task.id} style={{ 
             background: task.isCompleted ? '#1a1a1a' : '#2d2d2d', // Tamamlananlar daha koyu
             color: 'white',
             padding: '15px', margin: '10px 0', borderRadius: '8px',
             borderLeft: task.isCompleted ? '5px solid #20d34a' : '5px solid #007bff', // Yan çizgi rengi
             display: 'flex', justifyContent: 'space-between', alignItems: 'center',
             opacity: task.isCompleted ? 0.6 : 1, // Tamamlananlar biraz silik
             transition: '0.3s'
           }}>
             
             {/* DÜZENLEME MODU KONTROLÜ */}
             {editId === task.id ? (
               // Eğer düzenleme modundaysak INPUT göster
               <div style={{display: 'flex', gap: '5px', flex: 1}}>
                 <input 
                   value={editText} 
                   onChange={(e) => setEditText(e.target.value)}
                   style={{flex: 1, padding: '5px', borderRadius: '4px', border: 'none'}}
                 />
                 <button onClick={() => saveEdit(task.id)} style={{background: '#20d34a', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Save</button>
               </div>
             ) : (
               // Değilsek NORMAL YAZI göster
               <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                 <span 
                   onClick={() => toggleComplete(task.id)} 
                   style={{ 
                     textDecoration: task.isCompleted ? 'line-through' : 'none',
                     cursor: 'pointer', fontSize: '18px', fontWeight: '500'
                   }}
                 >
                   {task.content}
                 </span>
                 <span style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{task.createdAt}</span>
               </div>
             )}

             {/* BUTONLAR */}
             <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
               {/* Sadece edit modunda değilsek Edit butonunu göster */}
               {editId !== task.id && (
                 <button 
                   onClick={() => startEdit(task)}
                   style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                 >
                   Edit
                 </button>
               )}
               
               <button 
                 onClick={() => deleteTask(task.id)}
                 style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
               >
                 Del
               </button>
             </div>
           </li>
         ))}
      </ul>
    </div>
  );
}

export default App;