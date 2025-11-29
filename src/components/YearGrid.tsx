import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';
import { supabase } from '../integrations/supabase/client';
import type { WeekData, WorkloadStatus } from '../types/workload';
import { StatusSelector } from './StatusSelector';
import { Button } from './ui/button';
import { WeekActionDialog } from './WeekActionDialog';
import { WeekCircle } from './WeekCircle';

const WEEKS_PER_YEAR = 52;

const getCurrentWeek = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
};

export const YearGrid = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentWeek = getCurrentWeek();
  const { toast } = useToast();

  useEffect(() => {
    loadWeeks();
  }, [year]);

  const loadWeeks = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('workload_weeks')
        .select('*')
        .eq('year', year)
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Create all 52 weeks, filling in saved data where it exists
      const allWeeks: WeekData[] = Array.from(
        { length: WEEKS_PER_YEAR },
        (_, i) => {
          const weekNumber = i + 1;
          const savedWeek = data?.find((w) => w.week_number === weekNumber);
          return {
            weekNumber,
            status: (savedWeek?.status as WorkloadStatus) || 'undefined',
            notes: savedWeek?.notes || undefined,
          };
        }
      );

      setWeeks(allWeeks);
    } catch (error) {
      console.error('Error loading weeks:', error);
      toast({
        title: 'Error loading data',
        description: 'Failed to load workload data from database',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    weekNumber: number,
    status: WorkloadStatus
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from('workload_weeks').upsert(
        {
          year,
          week_number: weekNumber,
          status,
          user_id: session.user.id,
        },
        {
          onConflict: 'year,week_number,user_id',
        }
      );

      if (error) throw error;

      const updatedWeeks = weeks.map((week) =>
        week.weekNumber === weekNumber ? { ...week, status } : week
      );
      setWeeks(updatedWeeks);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error updating status',
        description: 'Failed to save status to database',
        variant: 'destructive',
      });
    }
  };

  const handleNotesChange = async (weekNumber: number, notes: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from('workload_weeks').upsert(
        {
          year,
          week_number: weekNumber,
          status:
            weeks.find((w) => w.weekNumber === weekNumber)?.status ||
            'undefined',
          notes,
          user_id: session.user.id,
        },
        {
          onConflict: 'year,week_number,user_id',
        }
      );

      if (error) throw error;

      const updatedWeeks = weeks.map((week) =>
        week.weekNumber === weekNumber ? { ...week, notes } : week
      );
      setWeeks(updatedWeeks);
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: 'Error updating notes',
        description: 'Failed to save notes to database',
        variant: 'destructive',
      });
    }
  };

  const handleWeekClick = (weekNumber: number) => {
    const week = weeks.find((w) => w.weekNumber === weekNumber);
    const hasNotes = week?.notes && week.notes.trim().length > 0;

    setSelectedWeek(weekNumber);

    if (hasNotes) {
      setShowActionDialog(true);
    } else {
      setShowStatusSelector(true);
    }
  };

  const handleEdit = () => {
    setShowActionDialog(false);
    setShowStatusSelector(true);
  };

  const handleCloseStatusSelector = () => {
    setShowStatusSelector(false);
    setSelectedWeek(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => setYear(year - 1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-semibold text-foreground">{year}</h2>
          <Button variant="ghost" size="icon" onClick={() => setYear(year + 1)}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-[13] gap-4 justify-items-center">
          {weeks.map((week) => (
            <WeekCircle
              key={week.weekNumber}
              weekNumber={week.weekNumber}
              status={week.status}
              hasNotes={!!week.notes && week.notes.trim().length > 0}
              isCurrentWeek={
                year === new Date().getFullYear() &&
                week.weekNumber === currentWeek
              }
              onClick={() => handleWeekClick(week.weekNumber)}
            />
          ))}
        </div>
      </div>

      {selectedWeek && (
        <>
          <WeekActionDialog
            open={showActionDialog}
            onOpenChange={setShowActionDialog}
            weekNumber={selectedWeek}
            status={
              weeks.find((w) => w.weekNumber === selectedWeek)?.status ||
              'undefined'
            }
            notes={weeks.find((w) => w.weekNumber === selectedWeek)?.notes}
            onEdit={handleEdit}
          />

          <StatusSelector
            open={showStatusSelector}
            onOpenChange={handleCloseStatusSelector}
            weekNumber={selectedWeek}
            currentStatus={
              weeks.find((w) => w.weekNumber === selectedWeek)?.status ||
              'undefined'
            }
            currentNotes={
              weeks.find((w) => w.weekNumber === selectedWeek)?.notes
            }
            onStatusChange={(status) =>
              handleStatusChange(selectedWeek, status)
            }
            onNotesChange={(notes) => handleNotesChange(selectedWeek, notes)}
          />
        </>
      )}
    </div>
  );
};
