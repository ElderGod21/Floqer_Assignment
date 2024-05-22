import pandas as pd

class ProcessData:
    def __init__(self):
        self.data = pd.read_csv('static/dataset/salaries.csv')

    def __get_data(self):
        years = self.data['work_year'].unique()
        years = years.tolist()
        jobs = self.data.groupby('work_year')['job_title'].count()
        jobs = jobs.tolist()
        avg_salary = self.data.groupby('work_year')['salary_in_usd'].mean()
        avg_salary = avg_salary.tolist()
        return years, jobs, avg_salary
    
    def return_data(self):
        years, jobs, avg_salary = self.__get_data()
        return {'years': years, 'jobs': jobs, 'avg_salary': avg_salary}
    
    def return_sorted_data(self, about_column, sort_by):
        years, jobs, avg_salary = self.__get_data()
        df = pd.DataFrame({'years': years, 'jobs': jobs, 'avg_salary': avg_salary})
        df = df.sort_values(by=about_column, ascending=(sort_by == 'asc'))
        sorted_data = {
            'years': df['years'].tolist(),
            'jobs': df['jobs'].tolist(),
            'avg_salary': df['avg_salary'].tolist()
        }
        return sorted_data
    
    def return_data_v2(self, req_year):
        data = self.data[self.data['work_year'] == int(req_year)]
        jobs = data['job_title'].unique()
        jobs = jobs.tolist()
        job_count = data.groupby('job_title')['job_title'].count()
        job_count = job_count.tolist()
        return {'jobs': jobs, 'job_count': job_count, 'year': req_year}