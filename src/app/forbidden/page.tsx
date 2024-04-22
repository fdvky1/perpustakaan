
import Link from 'next/link';
export default function Forbidden() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <img
          src="https://res.cloudinary.com/razeshzone/image/upload/v1588316204/house-key_yrqvxv.svg"
          className="w-24 md:w-32 mx-auto mb-4"
          alt=""
        />
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-red-500">4</span>
          <span className="text-red-500">0</span>
          <span className="text-red-500">3</span>
        </h1>
        <h4 className="text-lg font-semibold mb-2">Access Denied!</h4>
        <p className="text-sm mb-4">
          You don’t have access to this area of application. Speak to your administrator to unblock this feature. You can go back to{' '}
          <Link href='/dashboard' className="text-blue-500 hover:underline">
            Dashboard
          </Link>
          .
        </p>
      </div>
    </div>
  );
}