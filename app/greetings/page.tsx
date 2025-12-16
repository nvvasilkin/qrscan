'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

export default function GreetingsPage() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentRating, setCurrentRating] = useState(4.5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [logoError, setLogoError] = useState(false)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [logoLoading, setLogoLoading] = useState(true)
  const [thumbnailLoading, setThumbnailLoading] = useState(true)
  const [googleLogoLoading, setGoogleLogoLoading] = useState(true)
  const [yelpLogoLoading, setYelpLogoLoading] = useState(true)

  // Check session synchronously before paint using useLayoutEffect
  useLayoutEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('restaurant_rating_session')
      if (sessionData) {
        try {
          const { timestamp, rating } = JSON.parse(sessionData)
          const now = Date.now()
          const threeHours = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
          
          if (now - timestamp < threeHours) {
            setCurrentRating(rating)
            setRatingSubmitted(true)
          } else {
            localStorage.removeItem('restaurant_rating_session')
          }
        } catch (error) {
          localStorage.removeItem('restaurant_rating_session')
        }
      }
      setIsReady(true)
    }

    checkSession()
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      audio.currentTime = 0
      setProgress(0)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const progressBarContainer = e.currentTarget
    const clickX = e.nativeEvent.offsetX
    const width = progressBarContainer.offsetWidth
    const percentage = clickX / width
    audio.currentTime = percentage * audio.duration
    setProgress(percentage * 100)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStarClick = (rating: number) => {
    setCurrentRating(rating)
  }

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating)
  }

  const handleStarsLeave = () => {
    setHoveredRating(0)
  }

  const submitRating = () => {
    if (currentRating === 0) {
      alert('Please select a rating before submitting')
      return
    }
    
    // Save session to localStorage
    const sessionData = {
      timestamp: Date.now(),
      rating: currentRating
    }
    localStorage.setItem('restaurant_rating_session', JSON.stringify(sessionData))
    
    setRatingSubmitted(true)
  }

  const displayRating = hoveredRating || currentRating

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <div className={styles.logoBorder}>
          {!logoError ? (
            <>
              {logoLoading && (
                <div className={`${styles.skeleton} ${styles.skeletonLogo}`}></div>
              )}
              <Image
                src="https://orderbyte.io/api/v1/download/brands/85854185-aaf6-4780-ba06-d4b988a0452e.png"
                alt="Restaurant Logo"
                width={300}
                height={200}
                className={`${styles.restaurantLogo} ${logoLoading ? styles.loading : ''}`}
                onError={() => {
                  setLogoError(true)
                  setLogoLoading(false)
                }}
                onLoad={() => setLogoLoading(false)}
                onLoadingComplete={() => setLogoLoading(false)}
                unoptimized
              />
            </>
          ) : (
            <div className={styles.logoFallback}>
              <div className={styles.logoBannerTop}>FLINTRIDGE</div>
              <div className={styles.logoMain}>ITALIAN DELI</div>
              <div className={styles.logoAmpersand}>&</div>
              <div className={styles.logoMain} style={{ fontSize: '36px' }}>PIZZA CO.</div>
              <div className={styles.logoBannerBottom}>DELICATESSEN</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.messageSection}>
        <h2 className={styles.messageTitle}>You have a message</h2>
        <div className={styles.audioPlayerContainer}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {thumbnailLoading && (
              <div className={`${styles.skeleton} ${styles.skeletonThumbnail}`}></div>
            )}
            <Image
              src="/restaurant-staff.jpg"
              alt="Flintridge Pizza Kitchen Staff"
              width={120}
              height={120}
              className={`${styles.audioThumbnail} ${thumbnailLoading ? styles.loading : ''}`}
              onLoad={() => setThumbnailLoading(false)}
              onLoadingComplete={() => setThumbnailLoading(false)}
              unoptimized
            />
          </div>
          <div className={styles.audioControls}>
            <button 
              className={styles.playButton}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className={styles.icon} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg className={styles.icon} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            <div className={styles.progressBarContainer} onClick={handleSeek}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }}>
                <div className={styles.progressDot}></div>
              </div>
            </div>
          </div>
          <audio
            ref={audioRef}
            preload="metadata"
            src="/audio.mp4"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>

      <div className={styles.ratingSection} style={{ visibility: isReady ? 'visible' : 'hidden' }}>
        {!ratingSubmitted ? (
          <>
            <h2 className={styles.ratingTitle}>Please rate us</h2>
            <div
              className={styles.starsContainer}
              onMouseLeave={handleStarsLeave}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`${styles.star} ${
                    rating <= displayRating ? '' : styles.empty
                  } ${rating === 5 && currentRating === 4.5 && !hoveredRating ? styles.half : ''}`}
                  onClick={() => handleStarClick(rating)}
                  onMouseEnter={() => handleStarHover(rating)}
                >
                  ★
                </span>
              ))}
            </div>
            <button className={styles.submitButton} onClick={submitRating}>
              Submit
            </button>
          </>
        ) : (
          <>
            {currentRating >= 4 ? (
              <>
                <h2 className={styles.thankYouTitle}>Thanks for your review!</h2>
                <p className={styles.thankYouText}>Please share your review online by clicking on Google and/or Yelp below.</p>
                <div className={styles.reviewsSection}>
                  <a href="https://g.page/r/CV058mFt7KibEAE/review" className={styles.reviewPlatform} target="_blank" rel="noopener noreferrer">
                    <div style={{ position: 'relative' }}>
                      {googleLogoLoading && (
                        <div className={`${styles.skeleton} ${styles.skeletonReviewLogo}`} style={{ maxWidth: '180px' }}></div>
                      )}
                      <Image
                        src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                        alt="Google Reviews"
                        width={180}
                        height={60}
                        className={`${styles.reviewLogo} ${googleLogoLoading ? styles.loading : ''}`}
                        onLoad={() => setGoogleLogoLoading(false)}
                        onLoadingComplete={() => setGoogleLogoLoading(false)}
                        unoptimized
                      />
                    </div>
                    <div className={styles.googleReviewsText}>Reviews</div>
                    <div className={styles.googleStars}>★★★★★</div>
                  </a>
                  <a href="https://www.yelp.com/writeareview/biz/ZzDaZP8TPhBXWvZrLNLwFg?return_url=%2Fbiz%2FZzDaZP8TPhBXWvZrLNLwFg&review_origin=biz-details-war-button" className={styles.reviewPlatform} target="_blank" rel="noopener noreferrer">
                    <div style={{ position: 'relative' }}>
                      {yelpLogoLoading && (
                        <div className={`${styles.skeleton} ${styles.skeletonReviewLogo}`} style={{ maxWidth: '150px' }}></div>
                      )}
                      <Image
                        src="/yelp-logo.svg"
                        alt="Yelp"
                        width={150}
                        height={60}
                        className={`${styles.reviewLogo} ${yelpLogoLoading ? styles.loading : ''}`}
                        onLoad={() => setYelpLogoLoading(false)}
                        onLoadingComplete={() => setYelpLogoLoading(false)}
                        unoptimized
                      />
                    </div>
                  </a>
                </div>
              </>
            ) : (
              <>
                <h2 className={styles.thankYouTitle}>We&apos;re sorry to hear about your negative experience.</h2>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
