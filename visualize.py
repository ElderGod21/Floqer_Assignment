import pandas as pd
import matplotlib
from matplotlib import pyplot as plt

matplotlib.use('Agg')

class Visualize:
    def __init__(self):
        self.data = pd.read_csv('static/dataset/salaries.csv')
    
    def make_and_save_graph(self):
        self.data['work_year'] = pd.to_datetime(self.data['work_year'], format='%Y')
        self.data = self.data[self.data['work_year'].dt.year >= 2020]
        mean_salary_by_year = self.data.groupby(self.data['work_year'].dt.year)['salary_in_usd'].mean()
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(mean_salary_by_year.index, mean_salary_by_year.values, marker='o', linestyle='-')
        ax.set_title('Average Salary Trend (2020-2024)')
        ax.set_xlabel('Year')
        ax.set_ylabel('Average Salary (USD)')
        ax.grid(True)
        ax.set_xticks(mean_salary_by_year.index)
        plt.tight_layout()
        return fig