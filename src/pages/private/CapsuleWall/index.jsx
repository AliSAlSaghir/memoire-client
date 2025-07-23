import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./styles.css";
import { useCapsuleWallLogic } from ".";

const CapsuleWall = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const {
    filters,
    setFilters,
    capsules,
    moodOptions,
    loading,
    hasMore,
    countryOptions,
    applyFilters,
    getCardSize,
    dateOptions,
  } = useCapsuleWallLogic(scrollContainerRef);

  return (
    <main
      className="wall-content"
      ref={scrollContainerRef}
      style={{ overflowY: "auto", height: "100vh" }}
    >
      <section className="filters">
        <div className="filter-group">
          <label htmlFor="countryFilter">Country</label>
          <select
            id="countryFilter"
            value={filters.country}
            onChange={e =>
              setFilters(prev => ({ ...prev, country: e.target.value }))
            }
          >
            <option value="">All Countries</option>
            {countryOptions.map(country => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="moodFilter">Mood</label>
          <select
            id="moodFilter"
            value={filters.mood}
            onChange={e =>
              setFilters(prev => ({ ...prev, mood: e.target.value }))
            }
          >
            <option value="">All Moods</option>
            {moodOptions?.map(mood => (
              <option key={mood} value={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="dateRangeFilter">Date</label>
          <select
            id="dateRangeFilter"
            value={filters.dateRange}
            onChange={e =>
              setFilters(prev => ({ ...prev, dateRange: e.target.value }))
            }
          >
            <option value="">All Time</option>
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button id="applyFilters" onClick={applyFilters} disabled={loading}>
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </section>

      <div className="masonry">
        {capsules.map(capsule => (
          <div
            key={capsule.id}
            className={`card ${getCardSize(capsule)}`}
            onClick={() => navigate(`/capsules/${capsule.id}`)}
            style={{
              cursor: "pointer",
              border: `4px solid ${capsule.color || "#ddd"}`,
            }}
          >
            {capsule.cover_image_url && (
              <img
                src={capsule.cover_image_url}
                alt={capsule.title}
                className="card-image"
              />
            )}
            <div className="card-content">
              <div className="card-header">
                <span className="emoji">{capsule.emoji}</span>
                <p className="card-text">
                  {`${capsule.user.name} was ${capsule.mood} in ${
                    capsule.location.country
                  } on ${new Date(capsule.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}.`}
                </p>
              </div>
              {capsule.title && <h3 className="card-title">{capsule.title}</h3>}
            </div>
          </div>
        ))}
        {loading && <p>Loading more capsules...</p>}
      </div>
    </main>
  );
};

export default CapsuleWall;
