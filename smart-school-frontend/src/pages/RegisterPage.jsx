import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Register from '../components/auth/Register';

function RegisterPage() {
  return (
    <div className="register-page">
      <Header />
      <main>
        <Register />
      </main>
      <Footer />
    </div>
  );
}

export default RegisterPage;