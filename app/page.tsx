import Form from "./components/form";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-10 md:mt-14 lg:mt-20">
        YouTube Video Sharer
      </h1>

      <Form />
    </div>
  );
}
