import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3 border-gray-500">
      <div className="text-gray-500">
        Built by{" "}
        <a
          href="https://github.com/vishnusankar2203"
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline transition hover:text-gray-300 underline-offset-2"
        >
          Vishnu
        </a>
      
          
        
       
      // Fixed: removed stray whitespace and invalid code
      </div>
    </footer>
  );
}
