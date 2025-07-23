import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import "./styles.css";
import api from "../../../services/axios";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const dateOptions = [
  { label: "Last Hour", value: "last_hour" },
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
];

function getCardSize(capsule) {
  if (capsule.cover_image_url) return "tall";
  if ((capsule.title || "").length > 30) return "medium";
  return "short";
}

function getDateFromRange(range) {
  const now = new Date();
  switch (range) {
    case "last_hour":
      return new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();
    case "today":
      return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    case "last_7_days":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case "this_month":
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    case "this_year":
      return new Date(now.getFullYear(), 0, 1).toISOString();
    default:
      return "";
  }
}

const CapsuleWall = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [filters, setFilters] = useState({
    country: "",
    mood: "",
    dateRange: "",
  });

  const [capsules, setCapsules] = useState([]);
  const [moodOptions, setMoodOptions] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(
    "capsules?page=1&revealed_only=true&privacy=public"
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [countryOptions, setCountryOptions] = useState([]);

  const lastFetchedUrl = useRef(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const countryObj = countries.getNames("en", { select: "official" });
    const countryArray = Object.entries(countryObj).map(([code, name]) => ({
      code,
      name,
    }));
    setCountryOptions(countryArray);

    fetchMoods();

    fetchInitialCapsules(nextPageUrl);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
      if (
        scrollTop + clientHeight >= scrollHeight - 300 &&
        !loadingRef.current &&
        hasMore
      ) {
        if (!nextPageUrl || loadingRef.current) return;
        fetchMoreCapsules(); // Corrected to use pagination function
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [hasMore, nextPageUrl]);

  const fetchInitialCapsules = async url => {
    if (!url || loadingRef.current) return;

    lastFetchedUrl.current = url;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await api.get(url);
      setCapsules(res.data.data);

      if (res.data.links.next) {
        const nextUrlObj = new URL(res.data.links.next);
        const relativePath = nextUrlObj.pathname.replace(/^\/api\/v0\.1\//, "");
        const nextParams = nextUrlObj.searchParams;

        nextParams.set("revealed_only", "true");
        nextParams.set("privacy", "public");

        setNextPageUrl(`${relativePath}?${nextParams.toString()}`);
      } else {
        setNextPageUrl(null);
      }

      setHasMore(!!res.data.links.next);
    } catch (err) {
      console.error("Failed to fetch capsules:", err);
      toast.error("Something went wrong loading capsules.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const fetchMoods = async () => {
    try {
      const res = await api.get("capsules/moods"); // your moods endpoint
      setMoodOptions(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch moods:", err);
      toast.error("Failed to load moods.");
    }
  };

  // ADDED: Pagination function
  const fetchMoreCapsules = async () => {
    if (!nextPageUrl || loadingRef.current) return;

    lastFetchedUrl.current = nextPageUrl;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await api.get(nextPageUrl);
      setCapsules(prev => [...prev, ...res.data.data]); // Append to existing

      if (res.data.links.next) {
        const nextUrlObj = new URL(res.data.links.next);
        const relativePath = nextUrlObj.pathname.replace(/^\/api\/v0\.1\//, "");
        const nextParams = nextUrlObj.searchParams;

        nextParams.set("revealed_only", "true");
        nextParams.set("privacy", "public");

        setNextPageUrl(`${relativePath}?${nextParams.toString()}`);
      } else {
        setNextPageUrl(null);
      }

      setHasMore(!!res.data.links.next);
    } catch (err) {
      console.error("Failed to fetch capsules:", err);
      toast.error("Something went wrong loading more capsules.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    queryParams.set("revealed_only", "true");
    queryParams.set("privacy", "public");

    if (filters.country) queryParams.set("country", filters.country);
    if (filters.mood) queryParams.set("mood", filters.mood);

    const date = getDateFromRange(filters.dateRange);
    if (date) queryParams.set("date", date);

    const newUrl = `capsules?page=1&${queryParams.toString()}`;

    // Reset state
    setCapsules([]);
    setNextPageUrl(null);
    setHasMore(true);
    loadingRef.current = false;
    lastFetchedUrl.current = null;

    // Scroll to top for better UX
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }

    // Fetch with new filters
    fetchInitialCapsules(newUrl);
  };

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
            {moodOptions.map(mood => (
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
