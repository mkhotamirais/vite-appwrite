import { Link } from "react-router";
import DynamicHead from "../components/DynamicHead";
import Layout from "../components/Layout";
import useAuth from "../context/useAuth";

export default function Home() {
  const { user } = useAuth();
  return (
    <Layout>
      <DynamicHead title="Home" />
      <h1>halo {user?.name}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/book" className="btn">
          Book
        </Link>
        <Link to="/product" className="btn">
          Product
        </Link>
      </div>
    </Layout>
  );
}
