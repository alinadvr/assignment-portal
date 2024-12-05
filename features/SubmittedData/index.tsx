"use client";

import Link from "next/link";

const SubmittedData = () => {
  if (typeof window === undefined) return null;

  const localStorageData = localStorage.getItem("form-data");
  const formData = localStorageData ? JSON.parse(localStorageData) : null;

  if (!formData)
    return (
      <>
        <h1 className="text-center text-4xl font-bold leading-[1.3] text-gray-300">
          You have not submitted form yet
        </h1>
        <Link
          href="/"
          className="-mt-4 text-gray-400 underline transition-colors hover:text-gray-500"
        >
          Fill out the form
        </Link>
      </>
    );

  return (
    <>
      <h1 className="text-center text-4xl font-bold leading-[1.3] text-gray-300">
        Thank you for submitting the form!
      </h1>
      <h2 className="-mt-4 text-gray-500">Your latest submitted data:</h2>
      <ul>
        {Object.entries(formData).map(([key, value]) => (
          <li key={key} className="text-gray-100">
            {key}: {value as string}
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="text-gray-400 underline transition-colors hover:text-gray-500"
      >
        Fill out the form again
      </Link>
    </>
  );
};

export default SubmittedData;
