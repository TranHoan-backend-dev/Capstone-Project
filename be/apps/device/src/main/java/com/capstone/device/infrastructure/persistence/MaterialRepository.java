@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {

    // Search materials by name (jobContent) - case-insensitive partial match
    List<Material> findByJobContentContainingIgnoreCase(String jobContent);

    // Filter materials by price range
    List<Material> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Combined search and filter - search by name AND filter by price range
    List<Material> findByJobContentContainingIgnoreCaseAndPriceBetween(String jobContent, BigDecimal minPrice, BigDecimal maxPrice);
    // Search materials by name (jobContent) - case-insensitive partial match
    List<Material> findByJobContentContainingIgnoreCase(String jobContent);

    // Filter materials by price range
    List<Material> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Combined search and filter - search by name AND filter by price range
    List<Material> findByJobContentContainingIgnoreCaseAndPriceBetween(String jobContent, BigDecimal minPrice, BigDecimal maxPrice);
}