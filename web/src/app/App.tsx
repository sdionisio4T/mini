import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { CourseHome } from '../features/course/CourseHome';
import { LessonPage } from '../features/course/LessonPage';
import { LabPage } from '../features/exploration/LabPage';
import { HomePage } from './HomePage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/curso" element={<CourseHome />} />
        <Route path="/leccion/:lessonId" element={<LessonPage />} />
        <Route path="/laboratorio" element={<LabPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
