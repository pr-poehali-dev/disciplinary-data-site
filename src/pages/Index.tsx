import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Violator {
  id: string;
  fullName: string;
  position: string;
  department: string;
  employeeId: string;
}

interface Violation {
  id: string;
  violatorId: string;
  violatorName: string;
  violationType: string;
  date: string;
  description: string;
  penalty: string;
  status: 'active' | 'closed' | 'under_review';
}

const Index = () => {
  const { toast } = useToast();
  const [violators, setViolators] = useState<Violator[]>([
    { id: '1', fullName: 'Иванов Иван Иванович', position: 'Специалист', department: 'Отдел продаж', employeeId: 'EMP001' },
    { id: '2', fullName: 'Петрова Мария Сергеевна', position: 'Менеджер', department: 'Отдел маркетинга', employeeId: 'EMP002' },
  ]);

  const [violations, setViolations] = useState<Violation[]>([
    {
      id: '1',
      violatorId: '1',
      violatorName: 'Иванов Иван Иванович',
      violationType: 'Опоздание',
      date: '2024-01-15',
      description: 'Опоздание на работу на 30 минут без уважительной причины',
      penalty: 'Замечание',
      status: 'active'
    },
    {
      id: '2',
      violatorId: '2',
      violatorName: 'Петрова Мария Сергеевна',
      violationType: 'Нарушение дресс-кода',
      date: '2024-01-10',
      description: 'Несоответствие корпоративному дресс-коду',
      penalty: 'Выговор',
      status: 'closed'
    },
  ]);

  const [newViolator, setNewViolator] = useState({
    fullName: '',
    position: '',
    department: '',
    employeeId: ''
  });

  const [newViolation, setNewViolation] = useState({
    violatorId: '',
    violationType: '',
    date: '',
    description: '',
    penalty: ''
  });

  const [isAddViolatorOpen, setIsAddViolatorOpen] = useState(false);
  const [isAddViolationOpen, setIsAddViolationOpen] = useState(false);

  const addViolator = () => {
    if (!newViolator.fullName || !newViolator.position || !newViolator.department || !newViolator.employeeId) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    const violator: Violator = {
      id: Date.now().toString(),
      ...newViolator
    };

    setViolators([...violators, violator]);
    setNewViolator({ fullName: '', position: '', department: '', employeeId: '' });
    setIsAddViolatorOpen(false);
    
    toast({
      title: 'Успешно',
      description: 'Нарушитель добавлен в систему'
    });
  };

  const addViolation = () => {
    if (!newViolation.violatorId || !newViolation.violationType || !newViolation.date || !newViolation.description || !newViolation.penalty) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    const violator = violators.find(v => v.id === newViolation.violatorId);
    if (!violator) return;

    const violation: Violation = {
      id: Date.now().toString(),
      ...newViolation,
      violatorName: violator.fullName,
      status: 'active'
    };

    setViolations([...violations, violation]);
    setNewViolation({ violatorId: '', violationType: '', date: '', description: '', penalty: '' });
    setIsAddViolationOpen(false);
    
    toast({
      title: 'Успешно',
      description: 'Взыскание назначено'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Активно', variant: 'default' as const },
      closed: { label: 'Закрыто', variant: 'secondary' as const },
      under_review: { label: 'На рассмотрении', variant: 'outline' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const stats = {
    totalViolators: violators.length,
    totalViolations: violations.length,
    activeViolations: violations.filter(v => v.status === 'active').length,
    closedViolations: violations.filter(v => v.status === 'closed').length
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Icon name="Shield" className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Система управления дисциплинарными взысканиями</h1>
              <p className="text-sm text-muted-foreground">Учет нарушений и назначение взысканий</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего нарушителей</CardTitle>
              <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalViolators}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего взысканий</CardTitle>
              <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalViolations}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные взыскания</CardTitle>
              <Icon name="AlertCircle" className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.activeViolations}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Закрытые взыскания</CardTitle>
              <Icon name="CheckCircle2" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-muted-foreground">{stats.closedViolations}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Список нарушителей</CardTitle>
                  <CardDescription>Управление базой сотрудников с нарушениями</CardDescription>
                </div>
                <Dialog open={isAddViolatorOpen} onOpenChange={setIsAddViolatorOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Icon name="Plus" className="mr-2 h-4 w-4" />
                      Добавить
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить нарушителя</DialogTitle>
                      <DialogDescription>Введите данные сотрудника</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">ФИО</Label>
                        <Input
                          id="fullName"
                          value={newViolator.fullName}
                          onChange={(e) => setNewViolator({ ...newViolator, fullName: e.target.value })}
                          placeholder="Иванов Иван Иванович"
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Должность</Label>
                        <Input
                          id="position"
                          value={newViolator.position}
                          onChange={(e) => setNewViolator({ ...newViolator, position: e.target.value })}
                          placeholder="Специалист"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Отдел</Label>
                        <Input
                          id="department"
                          value={newViolator.department}
                          onChange={(e) => setNewViolator({ ...newViolator, department: e.target.value })}
                          placeholder="Отдел продаж"
                        />
                      </div>
                      <div>
                        <Label htmlFor="employeeId">Табельный номер</Label>
                        <Input
                          id="employeeId"
                          value={newViolator.employeeId}
                          onChange={(e) => setNewViolator({ ...newViolator, employeeId: e.target.value })}
                          placeholder="EMP001"
                        />
                      </div>
                      <Button onClick={addViolator} className="w-full">Добавить нарушителя</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ФИО</TableHead>
                    <TableHead>Должность</TableHead>
                    <TableHead>Отдел</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violators.map((violator) => (
                    <TableRow key={violator.id}>
                      <TableCell className="font-medium">{violator.fullName}</TableCell>
                      <TableCell>{violator.position}</TableCell>
                      <TableCell>{violator.department}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Дисциплинарные взыскания</CardTitle>
                  <CardDescription>История назначенных взысканий</CardDescription>
                </div>
                <Dialog open={isAddViolationOpen} onOpenChange={setIsAddViolationOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="default">
                      <Icon name="Plus" className="mr-2 h-4 w-4" />
                      Назначить
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Назначить взыскание</DialogTitle>
                      <DialogDescription>Заполните данные о нарушении</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="violatorId">Нарушитель</Label>
                        <Select value={newViolation.violatorId} onValueChange={(value) => setNewViolation({ ...newViolation, violatorId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите сотрудника" />
                          </SelectTrigger>
                          <SelectContent>
                            {violators.map((violator) => (
                              <SelectItem key={violator.id} value={violator.id}>
                                {violator.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="violationType">Тип нарушения</Label>
                        <Select value={newViolation.violationType} onValueChange={(value) => setNewViolation({ ...newViolation, violationType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Опоздание">Опоздание</SelectItem>
                            <SelectItem value="Прогул">Прогул</SelectItem>
                            <SelectItem value="Нарушение дресс-кода">Нарушение дресс-кода</SelectItem>
                            <SelectItem value="Несоблюдение техники безопасности">Несоблюдение техники безопасности</SelectItem>
                            <SelectItem value="Невыполнение обязанностей">Невыполнение обязанностей</SelectItem>
                            <SelectItem value="Другое">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Дата нарушения</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newViolation.date}
                          onChange={(e) => setNewViolation({ ...newViolation, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Описание</Label>
                        <Textarea
                          id="description"
                          value={newViolation.description}
                          onChange={(e) => setNewViolation({ ...newViolation, description: e.target.value })}
                          placeholder="Подробное описание нарушения"
                        />
                      </div>
                      <div>
                        <Label htmlFor="penalty">Взыскание</Label>
                        <Select value={newViolation.penalty} onValueChange={(value) => setNewViolation({ ...newViolation, penalty: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите взыскание" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Замечание">Замечание</SelectItem>
                            <SelectItem value="Выговор">Выговор</SelectItem>
                            <SelectItem value="Строгий выговор">Строгий выговор</SelectItem>
                            <SelectItem value="Увольнение">Увольнение</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addViolation} className="w-full">Назначить взыскание</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {violations.map((violation) => (
                  <div key={violation.id} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{violation.violatorName}</h4>
                        <p className="text-sm text-muted-foreground">{violation.violationType}</p>
                      </div>
                      {getStatusBadge(violation.status)}
                    </div>
                    <p className="text-sm text-foreground mb-2">{violation.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" className="h-3 w-3" />
                        {new Date(violation.date).toLocaleDateString('ru-RU')}
                      </span>
                      <span className="font-medium text-accent">{violation.penalty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
