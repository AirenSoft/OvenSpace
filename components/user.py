class User:

    _instance = None

    @classmethod
    def _get_instance(cls):
        return cls._instance

    @classmethod
    def instance(cls, *args, **kargs):
        cls._instance = cls(*args, **kargs)
        cls.instance = cls._get_instance
        return cls._instance

    def __init__(self):

        self.user_count = 0

    def add_user(self):

        self.user_count = self.user_count + 1

    def remove_user(self):

        self.user_count = self.user_count - 1

    def get_user_count(self):

        return self.user_count
