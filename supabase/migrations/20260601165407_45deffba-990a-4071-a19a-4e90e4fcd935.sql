-- Revoke all default execution rights
REVOKE ALL ON FUNCTION find_profile_by_code(TEXT) FROM PUBLIC;

-- Grant execution only to specific roles
GRANT EXECUTE ON FUNCTION find_profile_by_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION find_profile_by_code(TEXT) TO service_role;
