import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
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

export function useCapsuleWallLogic(scrollContainerRef) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        fetchMoreCapsules();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [hasMore, nextPageUrl, scrollContainerRef]);

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
      const res = await api.get("capsules/moods");
      setMoodOptions(res?.data?.payload?.data || []);
    } catch (err) {
      console.error("Failed to fetch moods:", err);
      toast.error("Failed to load moods.");
    }
  };

  const fetchMoreCapsules = async () => {
    if (!nextPageUrl || loadingRef.current) return;

    lastFetchedUrl.current = nextPageUrl;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await api.get(nextPageUrl);
      setCapsules(prev => [...prev, ...res.data.data]);

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

    setCapsules([]);
    setNextPageUrl(null);
    setHasMore(true);
    loadingRef.current = false;
    lastFetchedUrl.current = null;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }

    fetchInitialCapsules(newUrl);
  };

  return {
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
  };
}
