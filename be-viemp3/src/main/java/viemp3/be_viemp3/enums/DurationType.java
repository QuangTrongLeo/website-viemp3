package viemp3.be_viemp3.enums;

public enum DurationType {
    ONE_MONTH(1),
    THREE_MONTHS(3),
    SIX_MONTHS(6);

    private final int months;
    DurationType(int months) { this.months = months; }
    public int getMonths() { return months; }
}
