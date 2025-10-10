package com.sample;

import org.junit.Test;
import static org.junit.Assert.*;

public class SampleTest {
    @Test
    public void testAdd() {
        assertEquals(5, Sample.add(2, 3));
    }
}
