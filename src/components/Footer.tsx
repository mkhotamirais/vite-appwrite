export default function Footer() {
  return (
    <footer className="h-16 border-t flex items-center justify-center mt-24">
      <small>
        Copyright &copy; {new Date().getFullYear()}{" "}
        <a href="/" className="hover:underline text-blue-500">
          Vite Appwrite
        </a>
      </small>
    </footer>
  );
}
