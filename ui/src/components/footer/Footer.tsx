import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
    <div className="container mx-auto px-4 text-center">
      <p>&copy; {new Date().getFullYear()} TechBlog. All rights reserved.</p>
      {/* <nav className="mt-4">
        <ul className="flex justify-center space-x-4">
          <li><Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-gray-300">Terms of Service</Link></li>
          <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
        </ul>
      </nav> */}
    </div>
  </footer>
  )
}

export default Footer