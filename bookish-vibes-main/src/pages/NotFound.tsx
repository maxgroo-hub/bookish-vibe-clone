import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" }}
      >
        <div className="brutal-card bg-primary inline-block p-8 rounded-lg mb-6">
          <BookOpen className="w-16 h-16 text-primary-foreground mx-auto" />
        </div>
        <h1 className="font-heading text-7xl font-black mb-2">404</h1>
        <h2 className="font-heading text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like this book is missing from our shelves. Let's get you back to the library.
        </p>
        <Link
          to="/"
          className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
