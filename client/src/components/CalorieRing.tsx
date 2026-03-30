interface CalorieRingProps {
  consumed: number;
  target: number;
}

export default function CalorieRing({ consumed, target }: CalorieRingProps) {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(consumed / target, 1);
  const strokeDashoffset = circumference - progress * circumference;
  const remaining = target - consumed;
  const isOver = remaining < 0;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative">
        <svg width={radius * 2} height={radius * 2}>
          {/* 背景圆 */}
          <circle
            stroke="#f3f4f6"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* 进度圆 */}
          <circle
            stroke={isOver ? '#ef4444' : '#f97316'}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>
        {/* 中心文字 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${isOver ? 'text-red-500' : 'text-gray-800'}`}>
            {Math.abs(remaining)}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {isOver ? '超出 (千卡)' : '剩余 (千卡)'}
          </span>
        </div>
      </div>
      {/* 底部摘要 */}
      <div className="flex gap-8 mt-4 text-sm">
        <div className="text-center">
          <p className="text-gray-400">已摄入</p>
          <p className="font-semibold text-orange-500">{consumed}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400">目标</p>
          <p className="font-semibold text-gray-700">{target}</p>
        </div>
      </div>
    </div>
  );
}
