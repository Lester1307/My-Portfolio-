import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { createServer as createViteServer } from 'vite';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Firebase
let db: any;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const firebaseApp = initializeApp(firebaseConfig);
    const firestoreSettings = {
      experimentalForceLongPolling: true,
    };
    if (firebaseConfig.firestoreDatabaseId) {
      db = initializeFirestore(firebaseApp, firestoreSettings, firebaseConfig.firestoreDatabaseId);
      console.log(`Firebase initialized with database: ${firebaseConfig.firestoreDatabaseId} using long polling`);
    } else {
      db = initializeFirestore(firebaseApp, firestoreSettings);
      console.log('Firebase initialized with default database using long polling');
    }
  } else {
    console.error('firebase-applet-config.json not found! Cannot initialize Firestore.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Seed helper functions
async function seedDefaultData() {
  if (!db) return;

  try {
    // Check if projects collection is empty or if we need to migration/reseed
    const projectsRef = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsRef);
    
    let shouldSeedProjects = false;
    if (projectsSnapshot.empty) {
      shouldSeedProjects = true;
    } else {
      const projects = projectsSnapshot.docs.map(doc => doc.data());
      const hasSportsClub = projects.some(p => p.title && p.title.toLowerCase().includes('sports club'));
      if (!hasSportsClub) {
        console.log('Detected old projects in database. Clearing to seed the human-centric projects requested...');
        for (const doc of projectsSnapshot.docs) {
          await deleteDoc(doc.ref);
        }
        shouldSeedProjects = true;
      }
    }
    
    if (shouldSeedProjects) {
      console.log('Seeding default projects...');
      const defaultProjects = [
        {
          title: 'Sports Club Management',
          description: 'A beautifully designed booking and scheduling workspace for tennis, swimming, and athletics clubs. Features dynamic member profiles, interactive court reservations with real-time slot conflict resolution, multi-tier automated dues, and clean tournament bracket visualizations.',
          category: 'Full-Stack',
          technologies: ['React', 'Node.js', 'Express', 'Firebase Firestore', 'Tailwind CSS', 'Motion'],
          imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&auto=format&fit=crop&q=60',
          liveUrl: 'https://github.com',
          githubUrl: 'https://github.com',
          featured: true,
          order: 1
        },
        {
          title: 'Cinemax',
          description: 'A dark, highly immersive cinematic directory designed for dedicated movie buffs. Integrates full TMDB multi-threaded API endpoints, customizable personal movie lounges, hyper-fluid custom slider carousels, and an elegant micro-blogging review layer.',
          category: 'Frontend',
          technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'TMDB API'],
          imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60',
          liveUrl: 'https://github.com',
          githubUrl: 'https://github.com',
          featured: true,
          order: 2
        },
        {
          title: 'Freshwalls',
          description: 'A pristine, minimalist wall-art and mobile background collection showcasing professional aesthetic landscape photography. Features a tailored image-palette hex color extractor, an organic masonry layout, and smooth custom slide-up image drawers.',
          category: 'UI / Design',
          technologies: ['React', 'Vite', 'Tailwind CSS', 'Palette Extractor', 'Motion'],
          imageUrl: 'https://images.unsplash.com/photo-1500462969772-60dc59ffd11a?w=800&auto=format&fit=crop&q=60',
          liveUrl: 'https://github.com',
          githubUrl: 'https://github.com',
          featured: true,
          order: 3
        }
      ];

      for (const project of defaultProjects) {
        await addDoc(projectsRef, project);
      }
      console.log('Seeded default projects successfully.');
    }

    // Check if skills collection is empty
    const skillsRef = collection(db, 'skills');
    const skillsSnapshot = await getDocs(skillsRef);

    if (skillsSnapshot.empty) {
      console.log('Seeding default skills...');
      const defaultSkills = [
        // Frontend
        { name: 'React', category: 'Frontend', level: 90 },
        { name: 'TypeScript', category: 'Frontend', level: 85 },
        { name: 'Tailwind CSS', category: 'Frontend', level: 95 },
        { name: 'Vite / Bundlers', category: 'Frontend', level: 80 },
        { name: 'Motion / Animations', category: 'Frontend', level: 75 },
        // Backend
        { name: 'Node.js', category: 'Backend', level: 85 },
        { name: 'Express.js', category: 'Backend', level: 90 },
        { name: 'RESTful APIs', category: 'Backend', level: 90 },
        { name: 'Firebase / Firestore', category: 'Backend', level: 80 },
        // Tools & Design
        { name: 'Git & GitHub', category: 'Tools', level: 85 },
        { name: 'UI/UX Design Principles', category: 'Tools', level: 75 },
        { name: 'Docker / Containers', category: 'Tools', level: 60 }
      ];

      for (const skill of defaultSkills) {
        await addDoc(skillsRef, skill);
      }
      console.log('Seeded default skills successfully.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Perform Seeding
seedDefaultData();

// Admin Authentication Middleware
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const verifyAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Admin password mismatch.' });
  }
};

// ================= API ENDPOINTS =================

// Verification API
app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin passcode.' });
  }
});

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database connection not initialized' });
    }
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { title, description, category, technologies, imageUrl, liveUrl, githubUrl, featured, order } = req.body;
    
    const docRef = await addDoc(collection(db, 'projects'), {
      title,
      description,
      category,
      technologies: Array.isArray(technologies) ? technologies : [],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      featured: !!featured,
      order: Number(order) || 0
    });
    
    res.status(201).json({ id: docRef.id, message: 'Project added successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { id } = req.params;
    const projectRef = doc(db, 'projects', id);
    const { title, description, category, technologies, imageUrl, liveUrl, githubUrl, featured, order } = req.body;
    
    await updateDoc(projectRef, {
      title,
      description,
      category,
      technologies: Array.isArray(technologies) ? technologies : [],
      imageUrl,
      liveUrl,
      githubUrl,
      featured: !!featured,
      order: Number(order) || 0
    });
    
    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { id } = req.params;
    await deleteDoc(doc(db, 'projects', id));
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Skills API
app.get('/api/skills', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const skillsRef = collection(db, 'skills');
    const snapshot = await getDocs(skillsRef);
    const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(skills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/skills', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { name, category, level } = req.body;
    
    const docRef = await addDoc(collection(db, 'skills'), {
      name,
      category: category || 'General',
      level: Number(level) || 50
    });
    
    res.status(201).json({ id: docRef.id, message: 'Skill added successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/skills/:id', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { id } = req.params;
    const skillRef = doc(db, 'skills', id);
    const { name, category, level } = req.body;
    
    await updateDoc(skillRef, {
      name,
      category,
      level: Number(level) || 50
    });
    
    res.json({ success: true, message: 'Skill updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/skills/:id', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { id } = req.params;
    await deleteDoc(doc(db, 'skills', id));
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Contact API
app.post('/api/contact', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields' });
    }

    const docRef = await addDoc(collection(db, 'contact_messages'), {
      name,
      email,
      subject: subject || 'General Portfolio Query',
      message,
      createdAt: new Date().toISOString(),
      status: 'unread'
    });
    
    res.status(201).json({ id: docRef.id, message: 'Message sent successfully. Thank you!' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Contact Messages Admin API
app.get('/api/messages', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const messagesRef = collection(db, 'contact_messages');
    const snapshot = await getDocs(messagesRef);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort in code descending by createdAt
    messages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/messages/:id', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { id } = req.params;
    const { status } = req.body;
    const messageRef = doc(db, 'contact_messages', id);
    
    await updateDoc(messageRef, { status });
    res.json({ success: true, message: 'Message status updated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', verifyAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database connection not initialized' });
    const { id } = req.params;
    await deleteDoc(doc(db, 'contact_messages', id));
    res.json({ success: true, message: 'Message deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
