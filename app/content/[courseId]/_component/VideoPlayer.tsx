"use client";

export default function VideoPlayer({
    exercise,
}: any) {
    if (!exercise) {
        return (
            <div className="h-full flex items-center justify-center">
                Select a lesson
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-5xl">
                <div
                    className="
      overflow-hidden
      rounded-3xl
      border
      bg-black
      shadow-xl
      aspect-video
    "
                >
                    <video
                        controls
                        className="h-full w-full"
                        src={exercise?.videoUrl}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h1 className="text-3xl font-bold">
                    {exercise.title}
                </h1>

                <div className="mt-3 flex gap-2">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {exercise.pricing.type}
                    </span>
                </div>

                <p className="mt-6 text-gray-600 leading-relaxed">
                    {exercise.description ||
                        "No description available"}
                </p>
            </div>
        </div>
    );
}