import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function NotFound() {
  return (
    <div className="not-found">
      <Header />
      <main>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;