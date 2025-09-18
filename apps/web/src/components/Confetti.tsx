const pieces = Array.from({ length: 32 }, (_, index) => index);

export const Confetti: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    <div className="absolute inset-x-0 top-10 mx-auto flex w-full max-w-4xl flex-wrap justify-center gap-2 opacity-90">
      {pieces.map((piece) => (
        <span
          key={piece}
          className="h-2 w-6 animate-confetti rounded-full"
          style={{
            animationDelay: `${(piece % 10) * 80}ms`,
            backgroundColor: ['#8b5cf6', '#f97316', '#22c55e', '#14b8a6'][piece % 4],
          }}
        />
      ))}
    </div>
  </div>
);
