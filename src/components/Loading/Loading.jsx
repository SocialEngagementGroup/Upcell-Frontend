const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-5 py-16">
            <div className="flex items-center gap-2">
                {[0, 150, 300].map((delay) => (
                    <span
                        key={delay}
                        className="h-3 w-3 animate-bounce rounded-full bg-brand-red"
                        style={{ animationDelay: `${delay}ms` }}
                    />
                ))}
            </div>
            <p className="text-lg font-bold text-apple-text">Loading ...</p>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loading;
