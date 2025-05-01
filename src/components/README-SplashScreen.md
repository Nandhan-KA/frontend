# Splash Screen Implementation

This splash screen implementation displays a video intro with a splitting animation effect that reveals the main website content. 

## Features

- Displays an intro video (`entry_video.mp4`) from the public folder
- After the video ends, it splits in the middle with an animation effect
- Handles errors gracefully if the video cannot be played
- Uses localStorage to avoid showing the splash screen on every page refresh

## How to Use

1. The splash screen is already integrated with `App.tsx`
2. It will show on the initial visit and then remember the user has seen it for 3 hours

## File Structure

- `src/components/SplashScreen.tsx`: The main component
- `public/entry_video.mp4`: The intro video file
- `public/splash.html`: A standalone test file to preview the splash screen directly

## Direct Testing

You can test the splash screen animation directly by visiting:
- http://localhost:5000/splash.html (when running locally)

## Custom Configuration

You can adjust the following in `App.tsx`:

```jsx
// Change how long before showing the splash again (currently 3 hours)
const threeHours = 3 * 60 * 60 * 1000;

// Disable splash screen completely by setting to false
const [showSplash, setShowSplash] = useState(false); 
```

## Animation Settings

The animation timings and effects can be configured in:
- `tailwind.config.ts` - The main animation keyframes and durations
- `SplashScreen.tsx` - The timeout values and animation triggers

## Troubleshooting

If the video doesn't play:
1. Check if the video file exists in `public/entry_video.mp4`
2. The component has fallbacks for browsers that don't support autoplay
3. After 5 seconds, it will skip to the main content if the video doesn't load 