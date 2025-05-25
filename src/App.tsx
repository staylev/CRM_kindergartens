import { Route, Routes } from 'react-router-dom';
import Layout from './components/LayoutService';
import LoginForm from './components/LoginForm';
import MainHome from './components/home/MainHome';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { KindergartenContent } from './components/tabs/KindergartensContent';
import { GroupsContent } from './components/tabs/GroupsContent';
import { useEffect } from 'react';
import { startAccessTokenCheck } from './api/auth.api';
import { ChildrenContent } from './components/tabs/ChildrenContent';
import { EventsContent } from './components/tabs/EventsContent';
import '@ant-design/v5-patch-for-react-19';
import { ParentContent } from './components/tabs/ParentContent';
import VisitContent from './components/tabs/VisitContent';
import ChildCart from './components/cart/ChildCart';
import KindergartenDetail from './components/cart/kindergarten-detail';
import GroupDetailPage from './components/cart/group-detail-page';
import FinanceContent from './components/tabs/FinanceContent';
import ReportContent from './components/tabs/ReportContent';
import ParentDetailPage from './components/cart/parent-detail-page';
import EventDetailPage from './components/cart/event-detail-page';
 
const App: React.FC = () => {
    useEffect(() => {
        startAccessTokenCheck(); // Start the token check on app load
    }, []);

    return (
        <AuthProvider>
        <Routes>
          <Route path="login" element={<Layout><LoginForm /></Layout>} />
          <Route path="/" element={<ProtectedRoute><MainHome /></ProtectedRoute>}>
          <Route index element={<KindergartenContent />} />
          <Route path="Kindergartens" >
              <Route index element={<KindergartenContent />} />
              <Route path=":id" element={<KindergartenDetail />} />
            </Route>
            <Route path="groups" >
              <Route index element={<GroupsContent />} />
              <Route path=":id" element={<GroupDetailPage />} />
            </Route>
            <Route path="childrens">
              <Route index element={<ChildrenContent />} />
              <Route path=":id" element={<ChildCart />} />
            </Route>
            <Route path="events">
              <Route index element={<EventsContent />} />
              <Route path=":id" element={<EventDetailPage />} />
            </Route>
            <Route path="parents">
              <Route index element={<ParentContent />} />
              <Route path=":id" element={<ParentDetailPage />} />
            </Route>
            <Route path="visiting" element={<VisitContent />} />
            <Route path="finance" element={<FinanceContent />} />
            <Route path="reports" element={<ReportContent />} />
          </Route>
        </Routes>
      </AuthProvider>
    );
};

export default App;

 
