import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Login from '../components/auth/Login';

function LoginPage() {
  return (
    <div className="login-page">
      <Header />
      <main>
        <Login />
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;